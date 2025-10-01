// app/map.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, View, Platform, Linking, TouchableOpacity } from "react-native";

export default function MapScreen() {
  const iframeSrc =
    "https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID_HERE"; // <- put your real embed URL here

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Map & Venues</Text>

      <View style={styles.mapShell}>
        {Platform.OS === "web" ? (
          // NOTE: JSX 'iframe' is valid on web builds. TypeScript may warn, but it compiles.
          // @ts-ignore - intrinsic web element
          <iframe
            src={iframeSrc}
            width="100%"
            height="460"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <TouchableOpacity
            style={styles.cta}
            onPress={() => Linking.openURL("https://www.google.com/maps/search/?api=1&query=Stellenbosch")}
          >
            <Text style={styles.ctaText}>Open Map in Google Maps</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFF" },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: "#1B5E20", marginBottom: 12 },
  mapShell: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#eee" },
  cta: { backgroundColor: "#FF7E79", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700" },
});
