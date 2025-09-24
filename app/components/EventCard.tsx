import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { formatMapLink } from "../lib/venues";

export type Price = { text?: string|null };
export type Links = { tickets?: string|null; detail?: string|null; venue_map?: string|null };
export type Venue = { name?: string|null; slug?: string|null; lat?: number|null; lng?: number|null };

export type EventItem = {
  id: string;
  title: string;
  datetime?: string|null;
  date?: string|null;
  time?: string|null;
  price?: Price;
  links?: Links;
  venue?: Venue;
};

function formatWhen(e: EventItem) {
  if (e.datetime) return e.datetime.replace("T", " · ");
  if (e.date && e.time) return `${e.date} · ${e.time}`;
  return e.date || e.time || "";
}

export default function EventCard({ event }: { event: EventItem }) {
  const vname = event.venue?.name ?? "(venue TBC)";
  const mapUrl = event.links?.venue_map ?? formatMapLink(event.venue?.lat, event.venue?.lng, vname);

  return (
    <Link
      href={{ pathname: "/event/[id]", params: { id: event.id } }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>
          {!!formatWhen(event) && <Text style={styles.meta}>{formatWhen(event)}</Text>}

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
              <TouchableOpacity onPress={() => Linking.openURL(mapUrl)}>
                <Text style={styles.link}>Open in Maps</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: "600" },
  meta: { fontSize: 14, color: "#555" },
  bold: { fontWeight: "700", color: "#222" },
  row: { flexDirection: "row", gap: 16, marginTop: 10 },
  link: { color: "#2563eb" }
});
