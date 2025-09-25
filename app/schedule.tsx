import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import programme from "../assets/programme.json";
import venues from "../assets/venues.json";

type ProgrammeItem = {
  id?: string | number;
  title: string;
  date?: string;
  time?: string;
  venueId?: string | number;
  venue?: string;
  description?: string;
  tickets_url?: string;
};

type Venue = {
  id?: string | number;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
};

const venuesById = new Map<string | number, Venue>(
  (venues as Venue[]).map(v => [String(v.id ?? v.name), v])
);

export default function ScheduleScreen() {
  const data = (programme as ProgrammeItem[]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Program</Text>
      <FlatList
        data={data}
        keyExtractor={(item, i) => String(item.id ?? i)}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const venue =
            item.venue ??
            venuesById.get(String(item.venueId ?? ""))?.name ??
            "Onbekende venue";
          return (
            <View style={styles.card}>
              <Text style={styles.event}>{item.title}</Text>
              <Text style={styles.meta}>
                {(item.date ?? "").trim()} {(item.time ?? "").trim()} · {venue}
              </Text>
              {item.description ? (
                <Text style={styles.desc}>{item.description}</Text>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  sep: { height: 8 },
  card: { padding: 12, borderRadius: 12, backgroundColor: "#fff", elevation: 1, shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  event: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#6B7280", marginTop: 2 },
  desc: { marginTop: 6, color: "#111827" }
});
