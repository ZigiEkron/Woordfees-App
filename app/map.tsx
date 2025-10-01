// app/map.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, View, Platform, Linking, TouchableOpacity } from "react-native";

export default function MapScreen() {
  const iframeSrc = "https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID_HERE";

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kaart</Text>
      <View style={styles.mapShell}>
        {/* @ts-ignore web-only element */}
        <iframe src={iframeSrc} width="100%" height="460" style={{ border: 0 }} loading="lazy" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFF" },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: "#1B5E20", marginBottom: 12 },
  mapShell: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#eee" },
});
