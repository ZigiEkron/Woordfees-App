// app/venues/index.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Linking } from "react-native";

// Swap this path to wherever your venues data sits:
import venuesData from "../../assets/venues.json"; // ensure this file exists in repo

export default function VenuesScreen() {
  const [q, setQ] = useState("");

  const venues = useMemo(() => {
    const list = Array.isArray(venuesData) ? venuesData : [];
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter(v =>
      [v.name, v.address, v.area].filter(Boolean).some((t: string) => t.toLowerCase().includes(s))
    );
  }, [q]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Venues</Text>
      <TextInput
        style={styles.search}
        placeholder="Soek venue…"
        value={q}
        onChangeText={setQ}
      />

      {venues.map((v, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{v.name}</Text>
          {!!v.lat && !!v.lng && (
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`)
              }
            >
              Open in Google Maps ({v.lat},{v.lng})
            </Text>
          )}
          {!!v.address && <Text style={styles.subtle}>{v.address}</Text>}
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
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#eee" },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  link: { color: "#FF7E79", fontWeight: "600", marginBottom: 6 },
  subtle: { color: "#555" },
});
