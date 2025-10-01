// app/tickets.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import programme from "../assets/programme.json"; // put your programme JSON here

type EventRow = {
  id?: string;
  title?: string;
  time?: string;
  date?: string;
  venue?: string;
  tickets_url?: string;
  description?: string;
};

export default function TicketsScreen() {
  const [q, setQ] = useState("");

  const rows: EventRow[] = Array.isArray(programme) ? (programme as any) : [];

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      [r.title, r.venue, r.description].filter(Boolean).some((t: any) => String(t).toLowerCase().includes(s))
    );
  }, [q, rows]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kaartjies</Text>
      <TextInput
        style={styles.search}
        placeholder="Soek ’n produksie…"
        value={q}
        onChangeText={setQ}
      />

      {filtered.map((ev, i) => (
        <View key={ev.id ?? i} style={styles.card}>
          <Text style={styles.cardTitle}>{ev.title ?? "Onbekende item"}</Text>
          <Text style={styles.meta}>
            {ev.date ? `${ev.date}` : ""}{ev.time ? ` • ${ev.time}` : ""}{ev.venue ? ` • ${ev.venue}` : ""}
          </Text>
          {!!ev.description && <Text style={styles.desc}>{ev.description}</Text>}

          {!!ev.tickets_url && (
            <TouchableOpacity onPress={() => Linking.openURL(ev.tickets_url)} style={styles.cta}>
              <Text style={styles.ctaText}>Koop kaartjies</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFF" },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: "#1B5E20", marginBottom: 12 },
  search: {
    borderWidth: 1, borderColor: "#FF7E79", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12,
  },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  meta: { color: "#666", marginBottom: 6 },
  desc: { color: "#333", marginBottom: 10 },
  cta: { backgroundColor: "#FF7E79", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700" },
});
