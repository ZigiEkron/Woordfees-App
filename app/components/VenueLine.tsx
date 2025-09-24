import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { formatMapLink } from "../lib/venues";

type Venue = { name?: string|null; lat?: number|null; lng?: number|null };
type Links = { venue_map?: string|null };

export default function VenueLine({ venue, links }: { venue?: Venue; links?: Links }) {
  const vname = venue?.name ?? "(venue TBC)";
  const mapUrl = links?.venue_map ?? formatMapLink(venue?.lat, venue?.lng, vname);
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "700" }}>Venue: </Text>{vname}</Text>
      {!!mapUrl && (
        <TouchableOpacity style={{ marginTop: 6 }} onPress={() => Linking.openURL(mapUrl)}>
          <Text style={{ color: "#2563eb" }}>Directions</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
