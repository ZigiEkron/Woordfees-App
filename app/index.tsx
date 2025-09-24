import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView, View, Text, ActivityIndicator, RefreshControl,
  TouchableOpacity, Linking, StyleSheet,
} from "react-native";
import { Link } from "expo-router";

type VenueSlim = { slug: string; name: string; lat?: number|null; lng?: number|null };
type Links = { tickets?: string|null; detail?: string|null; venue_map?: string|null };
type Venue = { name?: string|null; slug?: string|null; lat?: number|null; lng?: number|null };
type EventItem = {
  id: string; title: string; datetime?: string|null; date?: string|null; time?: string|null;
  category?: string|null; language?: string|null; description?: string|null;
  price?: { text?: string|null }; links?: Links; venue?: Venue;
};

function formatWhen(e: EventItem) {
  if (e.datetime) return e.datetime.replace("T", " · ");
  if (e.date && e.time) return `${e.date} · ${e.time}`;
  return e.date || e.time || "";
}
function formatMapLink(lat?: number|null, lng?: number|null, name?: string|null) {
  if (typeof lat === "number" && typeof lng === "number") return `https://maps.google.com/?q=${lat},${lng}`;
  return name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}` : null;
}
async function loadProgramme(): Promise<EventItem[]> {
  const res = await fetch(require("./assets/data/programme.slim.json"));
  return res.json();
}
async function loadVenues(): Promise<Record<string, VenueSlim>> {
  const res = await fetch(require("./assets/data/venues.slim.json"));
  const list: VenueSlim[] = await res.json();
  return Object.fromEntries(list.map(v => [v.slug, v]));
}

function EventCard({ event }: { event: EventItem }) {
  const vname = event.venue?.name ?? "(venue TBC)";
  const mapUrl = event.links?.venue_map ?? formatMapLink(event.venue?.lat, event.venue?.lng, vname);
  const CardInner = (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      {!!formatWhen(event) && <Text style={styles.meta}>{formatWhen(event)}</Text>}
      {(event.category || event.language) && (
        <Text style={styles.meta}>{[event.category, event.language].filter(Boolean).join(" • ")}</Text>
      )}
      <View style={{ marginTop: 6 }}>
        <Text style={styles.meta}><Text style={styles.bold}>Venue: </Text>{vname}</Text>
      </View>
      <View style={styles.row}>
        {!!event.links?.tickets && (
          <TouchableOpacity onPress={() => Linking.openURL(event.links!.tickets!)}>
            <Text style={styles.link}>Buy tickets</Text>
          </TouchableOpacity>
        )}
        {!!mapUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(mapUrl!)}>
            <Text style={styles.link}>Open in Maps</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  return event.id ? (
    <Link href={{ pathname: "/event/[id]", params: { id: event.id } }} asChild>
      <TouchableOpacity activeOpacity={0.85}>{CardInner}</TouchableOpacity>
    </Link>
  ) : CardInner;
}

export default function EventsScreen() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const hydrate = useCallback(async () => {
    try {
      setError(null);
      const [raw, vdict] = await Promise.all([loadProgramme(), loadVenues()]);
      const hydrated = raw.map(e => {
        if (e.venue?.name || !e.venue?.slug) return e;
        const v = vdict[e.venue.slug];
        return v ? { ...e, venue: { ...e.venue, name: v.name, lat: v.lat, lng: v.lng } } : e;
      });
      setItems(hydrated);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { hydrate(); }, [hydrate]);
  const onRefresh = useCallback(() => { setRefreshing(true); hydrate(); }, [hydrate]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return (
    <View style={[styles.center, { padding: 16 }]}>
      <Text style={styles.title}>Could not load events</Text>
      <Text style={styles.meta}>{error}</Text>
      <TouchableOpacity style={{ marginTop: 12 }} onPress={hydrate}><Text style={styles.link}>Try again</Text></TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {items.length === 0
        ? <View style={styles.center}><Text style={styles.meta}>No events found.</Text></View>
        : items.map(ev => <EventCard key={ev.id} event={ev} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000",
          shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: "600" },
  meta: { fontSize: 14, color: "#555" },
  bold: { fontWeight: "700", color: "#222" },
  row: { flexDirection: "row", gap: 16, marginTop: 10 },
  link: { color: "#2563eb" },
});
