import { Stack } from "expo-router";
import { View, Text, Linking, TouchableOpacity, ScrollView } from "react-native";
import venues from "./assets/venues.json";

/**
 * Very simple web map screen:
 * - shows a Google Maps iframe (centered on Stellenbosch as an example)
 * - lists venues with "Open in Google Maps" links
 * No react-native-maps import = web-safe.
 */
export default function MapWeb() {
  const center = { lat: -33.936, lng: 18.861, zoom: 13 }; // tweak if you like

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Stack.Screen options={{ title: "Map" }} />

      <View style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 12, overflow: "hidden" }}>
        <iframe
          title="Woordfees Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${center.lat},${center.lng}&z=${center.zoom}&output=embed`}
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600" }}>Venues</Text>
      <ScrollView style={{ maxHeight: 420 }}>
        {Array.isArray(venues) &&
          venues.map((v: any, idx: number) => {
            const q = encodeURIComponent(v?.address || v?.name || "");
            const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
            return (
              <TouchableOpacity
                key={idx}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 12,
                  marginBottom: 8,
                }}
                onPress={() => Linking.openURL(url)}
              >
                <Text style={{ fontWeight: "600" }}>{v?.name || "Venue"}</Text>
                {v?.address ? <Text>{v.address}</Text> : null}
                <Text style={{ color: "#1a73e8", marginTop: 4 }}>Open in Google Maps</Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
