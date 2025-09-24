import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, ActivityIndicator } from "react-native";
import EventCard, { EventItem } from "../components/EventCard";
import { loadVenues } from "../lib/venues";

export default function EventsScreen() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setRefreshing(true);
    const [raw, vdict] = await Promise.all([
      fetch(require("../assets/data/programme.slim.json")).then(r => r.json()),
      loadVenues()
    ]);
    const hydrated: EventItem[] = raw.map((e: EventItem) => {
      if (e.venue?.name || !e.venue?.slug) return e;
      const v = vdict[e.venue.slug];
      return v ? { ...e, venue: { ...e.venue, name: v.name, lat: v.lat, lng: v.lng } } : e;
    });
    setItems(hydrated);
    setRefreshing(false);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator /></View>;
  }

  return (
    <ScrollView style={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
      {items.map(ev => (<EventCard key={ev.id} event={ev} />))}
    </ScrollView>
  );
}
