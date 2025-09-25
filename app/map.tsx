import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import venues from "../assets/venues.json";

// We keep MapView import inside a try/catch to avoid web build errors if the lib isn't available on web.
let MapView:any = null, Marker:any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
} catch {}

export default function MapScreen() {
  if (Platform.OS === "web" && !MapView) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.note}>
          Map preview is disabled on web unless Google Maps JS is injected. The venues list still loads.
        </Text>
        <View style={{marginTop:10}}>
          {(venues as any[]).map((v,i)=>(
            <Text key={i} style={{marginBottom:4}}>• {v.name} ({v.lat}, {v.lng})</Text>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: Number((venues as any[])[0]?.lat ?? -33.933),
          longitude: Number((venues as any[])[0]?.lng ?? 18.86),
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }}
      >
        {(venues as any[]).map((v, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: Number(v.lat), longitude: Number(v.lng) }}
            title={v.name}
            description={v.address ?? ""}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", padding: 16 },
  note: { color: "#6B7280", textAlign: "center", maxWidth: 600 }
});
