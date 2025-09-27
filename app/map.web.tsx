// app/map.web.tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView } from "react-native";
import venuesData from "./assets/venues.json";

type Venue = {
  slug?: string;
  name: string;
  address?: string;
  lat?: number | string | null;
  lng?: number | string | null;
};

function toNumber(n: unknown): number | undefined {
  if (n == null) return undefined;
  const x = Number(n);
  return Number.isFinite(x) ? x : undefined;
}

function buildIframeSrc(params: { query?: string; center?: { lat: number; lng: number }; zoom?: number }) {
  // If a query is given (e.g. venue name/address), use a search URL for the embed
  if (params.query && params.query.trim().length > 0) {
    const q = encodeURIComponent(params.query.trim());
    // Embeddable search
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }

  // Otherwise center the map on a sensible default or provided center
  const lat = params.center?.lat ?? -33.936;
  const lng = params.center?.lng ?? 18.861;
  const zoom = params.zoom ?? 13;
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${zoom}&output=embed`;
}

export default function MapWeb() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [filter, setFilter] = useState<string>("");

  const venues = useMemo(() => {
    // Ensure data is in the expected shape
    const arr = Array.isArray(venuesData) ? (venuesData as Venue[]) : [];
    return arr.map((v) => ({
      ...v,
      lat: toNumber(v.lat),
      lng: toNumber(v.lng),
    }));
  }, []);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return venues;
    return venues.filter((v) => {
      const n = (v.name || "").toLowerCase();
      const a = (v.address || "").toLowerCase();
      const s = (v.slug || "").toLowerCase();
      return n.includes(f) || a.includes(f) || s.includes(f);
    });
  }, [venues, filter]);

  // If a query param is passed, prefer it; otherwise center near Stellenbosch
  const iframeSrc = useMemo(
    () => buildIframeSrc({ query: typeof query === "string" ? query : undefined, center: { lat: -33.936, lng: 18.861 }, zoom: 13 }),
    [query]
  );

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Stack.Screen options={{ title: "Venues / Kaart" }} />

      {/* Map */}
      <View
        style={{
          width: "100%",
          maxWidth: 1100,
          alignSelf: "center",
          aspectRatio: 16 / 9,
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        {/* Web-only element is fine inside RN view on web */}
        <iframe
          title="Woordfees Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={iframeSrc}
        />
      </View>

      {/* Controls */}
      <View
        style={{
          width: "100%",
          maxWidth: 1100,
          alignSelf: "center",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Venues</Text>
        <View style={{ flex: 1, minWidth: 260 }}>
          <TextInput
            value={filter}
            onChangeText={setFilter}
            placeholder="Soek venue..."
            style={{
              width: "100%",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 10,
              fontSize: 14,
              backgroundColor: "white",
            }}
          />
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={{ width: "100%", maxWidth: 1100, alignSelf: "center", maxHeight: 480, borderRadius: 12, borderWidth: 1, borderColor: "#f3f4f6" }}
        contentContainerStyle={{ padding: 8 }}
      >
        {filtered.map((v, idx) => {
          const hasCoords = v.lat != null && v.lng != null;
          const mapsLink = hasCoords
            ? `https://www.google.com/maps?q=${encodeURIComponent(`${v.lat},${v.lng}`)}&z=15`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address || v.name)}`;

          return (
            <View
              key={v.slug ?? `${v.name}-${idx}`}
              style={{
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "white",
                marginBottom: 8,
                gap: 6,
              }}
            >
              <Text style={{ fontWeight: "700" }}>{v.name}</Text>
              {v.address ? <Text style={{ color: "#4b5563" }}>{v.address}</Text> : null}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity onPress={() => Linking.openURL(mapsLink)}>
                  <Text style={{ color: "#1a73e8", fontWeight: "600" }}>Open in Google Maps</Text>
                </TouchableOpacity>
                {hasCoords ? (
                  <Text style={{ color: "#6b7280" }}>
                    ({v.lat?.toString()},{v.lng?.toString()})
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
        {filtered.length === 0 && (
          <View style={{ padding: 16 }}>
            <Text style={{ color: "#6b7280" }}>Geen venues gevind nie.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
