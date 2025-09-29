import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import VenueLine from "../components/VenueLine";
import { loadVenues } from "\.\.\/\.\.\/lib\/venues";

type Links = { tickets?: string|null; detail?: string|null; venue_map?: string|null };
type Venue = { name?: string|null; slug?: string|null; lat?: number|null; lng?: number|null };

type EventItem = {
  id: string;
  title: string;
  datetime?: string|null;
  date?: string|null;
  time?: string|null;
  description?: string|null;
  category?: string|null;
  language?: string|null;
  price?: { text?: string|null };
  links?: Links;
  venue?: Venue;
};

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [raw, vdict] = await Promise.all([
        fetch(require("../assets/data/programme.slim.json")).then(r => r.json()),
        loadVenues()
      ]);
      const hydrated: EventItem[] = raw.map((e: EventItem) => {
        if (e.venue?.name || !e.venue?.slug) return e;
        const v = vdict[e.venue.slug];
        return v ? { ...e, venue: { ...e.venue, name: v.name, lat: v.lat, lng: v.lng } } : e;
      });
      const found = hydrated.find(e => e.id === id);
      setEvent(found || null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator /></View>;
  }
  if (!event) {
    return <View style={{ padding: 16 }}><Text style={{ fontSize: 18, fontWeight: "600" }}>Event not found</Text></View>;
  }

  const when = event.datetime
    ? event.datetime.replace("T", " · ")
    : event.date && event.time
      ? `${event.date} · ${event.time}`
      : event.date || event.time || "";

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{event.title}</Text>
      {!!when && <Text style={{ color: "#666", marginTop: 4 }}>{(when)}</Text>}
      {(event.category || event.language) && (
        <Text style={{ color: "#666", marginTop: 4 }}>
          {[event.category, event.language].filter(Boolean).join(" • ")}
        </Text>
      )}

      <VenueLine venue={event.venue} links={event.links} />

      {!!event.links?.tickets && (
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => Linking.openURL(event.links!.tickets!)}>
          <Text style={{ color: "#2563eb" }}>Buy tickets</Text>
        </TouchableOpacity>
      )}

      {!!event.description && <Text style={{ marginTop: 16, lineHeight: 22 }}>{event.description}</Text>}
    </ScrollView>
  );
}
