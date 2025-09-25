import React from "react";
import { View, Text, StyleSheet, Linking, Pressable } from "react-native";
import programme from "../assets/programme.json";

type Item = { title: string; tickets_url?: string };

export default function TicketsScreen() {
  const items = (programme as Item[]).filter(e => e.tickets_url);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaartjies</Text>
      {items.length === 0 ? (
        <Text style={styles.note}>Geen kaartjieskakels beskikbaar nie.</Text>
      ) : (
        items.slice(0, 50).map((e, i) => (
          <Pressable key={i} onPress={() => Linking.openURL(String(e.tickets_url))} style={styles.btn}>
            <Text style={styles.btnText}>{e.title}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  note: { color: "#6B7280" },
  btn: { padding: 12, borderRadius: 10, backgroundColor: "#1D4ED8" },
  btnText: { color: "#fff", fontWeight: "700" }
});
