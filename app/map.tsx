// app/map.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview"; // If not using this, keep your existing iframe approach

export default function MapScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Map & Venues</Text>
      <View style={styles.mapShell}>
        {/* Keep your existing <iframe> string in WebView, or your current map component */}
        <WebView
          source={{
            html: `<iframe src="https://www.google.com/maps/d/embed?mid=..." width="100%" height="450" style="border:0"></iframe>`,
          }}
          style={{ height: 460 }}
        />
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
