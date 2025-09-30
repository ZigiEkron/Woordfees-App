// app/event/[id].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Platform } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import ScreenShell from "../components/ScreenShell";
import VenueLine from "../components/VenueLine";
import { loadVenues } from "../../lib/venues";

// ---- Types (kept compatible with your data) ----
type Links = { tickets?: string | null; detail?: string | null; venue_map?: string | null };
type Venue = { name?: string | null; slug?: string | null; lat?: number | null; lng?: number | null };

type EventItem = {
  id: string;
  title: string;
  datetime?: string | null;
  date?: string | null;
  time?: string | null;
  description?: string | null;
  category?: string | null;
  language?: string | null;
  price?: { text?: string | null };
  links?: Links;
  venue?: Venue;
};

function openUrl(url: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  } else {
    Linking.openURL(url);
  }
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Build-time asset URL; fetch at runtime so static export works
      const programmeUrl = require("../assets/data/programme.slim.json");
      const [raw, vdict] = await Promise.all([
        fetch(programmeUrl).then((r) => r.json()),
        loadVenues(),
      ]);

      const hydrated: EventItem[] = (raw as EventItem[]).map((e) => {
        if (e.venue?.name || !e.venue?.slug) return e;
        const v = vdict[e.venue.slug];
        return v ? { ...e, venue: { ...e.venue, name: v.name, lat: v.lat, lng: v.lng } } : e;
        // vdict keys are slugs; we enrich venue name/coords when missing
      });

      const found = hydrated.find((e) => e.id === id);
      setEvent(found || null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <ScreenShell title="Program">
        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 32 }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 12 }}>Laai besonderhede…</Text>
        </View>
      </ScreenShell>
    );
  }

  if (!event) {
    return (
      <ScreenShell title="Program">
        <Card style={{ borderRadius: 16 }}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              Item nie gevind nie
            </Text>
            <Text variant="bodySmall" style={{ marginTop: 6 }}>
              Ons kon nie ’n gebeurtenis met ID <Text style={{ fontWeight: "700" }}>{id}</Text> vind nie.
            </Text>
          </Card.Content>
        </Card>
      </ScreenShell>
    );
  }

  const when = event.datetime
    ? event.datetime.replace("T", " · ")
    : event.date && event.time
    ? `${event.date} · ${event.time}`
    : event.date || event.time || "";

  return (
    <ScreenShell title="Program">
      <ScrollView>
        <Text variant="titleLarge" style={{ fontWeight: "700" }}>
          {event.title}
        </Text>

        {!!when && (
          <Text variant="bodyMedium" style={{ opacity: 0.75, marginTop: 4 }}>
            {when}
          </Text>
        )}

        {(event.category || event.language) && (
          <Text variant="bodySmall" style={{ opacity: 0.75, marginTop: 4 }}>
            {[event.category, event.language].filter(Boolean).join(" • ")}
          </Text>
        )}

        {/* Venue line (your existing component) */}
        <View style={{ marginTop: 12 }}>
          <VenueLine venue={event.venue} links={event.links} />
        </View>

        {/* Tickets */}
        {!!event.links?.tickets && (
          <View style={{ marginTop: 16, flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
            <Button mode="contained" onPress={() => openUrl(event.links!.tickets!)}>
              Koop kaartjies
            </Button>
          </View>
        )}

        {/* Description */}
        {!!event.description && (
          <Text variant="bodyMedium" style={{ marginTop: 16, lineHeight: 22 }}>
            {event.description}
          </Text>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
