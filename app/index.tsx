// app/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView, View, Text, ActivityIndicator, RefreshControl,
  TouchableOpacity, Linking, StyleSheet
} from "react-native";
import { Link } from "expo-router";

type VenueSlim = { slug: string; name: string; lat?: number|null; lng?: number|null };
type Links = { tickets?: string|null; detail?: string|null; venue_map?: string|null };
type Venue = { name?: string|null; slug?: string|null; lat?: number|null; lng?: number|null };
type EventItem = {
  id: string; title: string;
  datetime?: string|null; date?: string|null; time?: string|null;
  category?: string|null; language?: string|null; description?: string|null;
  price?: { text?: string|null }; links?: Links; venue?: Venue;
};

function formatWhen(e: EventItem) {
  if (e.datetime) return e.datetime.replace("T", " · ");
  if (e.date && e.time) return `${e.date} · ${e.time}`;
  return e.date || e.time || "";
}
function formatMapLink(lat?: number|null, lng?: number|null, name?: string|null) {
  if (typeof lat === "number" && typeof lng === "number") return `https://maps.google.com/?q=${lat},${lng}`;
  return name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}` : null;
}
async function loadProgramme(): Promise<EventItem[]> {
  const res = await fetch(require("./assets/data/programme.slim.json")); return res.json();
}
async function loadVenues(): Promise<Record<string, VenueSlim>> {
  const res = await fetch(require("./assets/data/venues.slim.json"));
  const list: VenueSlim[] = await res.json();
  return Object.fromEntries(list.map(v => [v.slug, v]));
}

function EventCard({ event }: { event: EventItem }) {
  const vname = event.venue?.name ?? "(venue TBC)";
  const mapUrl = event.links?.venue_map ?? formatMapLink(event.venue?.lat, event.venue?.lng, vname);
  const CardInner = (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      {!!formatWhen(event) && <Text style={styles.meta}>{formatWhen(event)}</Text>}
      {(event.category || event.language) && (
        <Text style={styles.meta}> {[event.category, event.language].filter(Boolean).join(" • ")} </Text>
      )}
