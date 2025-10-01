// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Woordfees Programme</Text>

      <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/schedule")}>
        <Text style={styles.tabText}>Program</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/map")}>
        <Text style={styles.tabText}>Kaart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#1B5E20", marginBottom: 20, textAlign: "center" },
  tabButton: {
    backgroundColor: "#FF7E79", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12,
    marginVertical: 10, width: "80%", alignItems: "center", elevation: 3,
  },
  tabText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
