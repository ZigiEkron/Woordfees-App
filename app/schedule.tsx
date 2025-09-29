// app/schedule.tsx
import { useMemo } from "react";
import { Platform, Linking, FlatList, View } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import ScreenShell from "./components/ScreenShell";
import { formatMapLink } from "../lib/venues";

// ---------- Build-time data imports (works on GitHub Pages) ----------
const rawProgramme = require("./assets/programme.json") as any[];
const rawVenues = require("./assets/venues.json") as Array<{
  slug?: string;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
}>;

// ---------- Venue lookups ----------
const venuesBySlug = Object.fromEntries(
  rawVenues
    .filter((v) => v.slug)
    .map((v) => [String(v.slug).toLowerCase(), v])
);

const venuesByName = Object.fromEntries(
  rawVenues.map((v) => [String(v.name).toLowerCase(), v])
);

// ---------- Helpers ----------
function coerceUrl(u: any): string | null {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  // handle relative paths stored in data
  return `https://woordfees.co.za/${s.replace(/^\/+/, "")}`;
}

function getTitle(r: any, i: number) {
  return r.title ?? r.Produksie ?? r.name ?? `Item ${i + 1}`;
}
function getDescription(r: any) {
  return r.description ?? r.Info ?? r.Beskrywing ?? "";
}
function getVenueName(r: any) {
  return r.venueName ?? r.Venue ?? r.venue ?? r.location ?? r.Ligging ?? "";
}
function getVenueSlug(r: any) {
  return r.venueSlug ?? r.venue_slug ?? r.venue_id ?? r.venueKey ?? "";
}
function getTicketsUrl(r: any) {
  return (
    r.tickets_url ??
    r.ticket_url ??
    r.ticketsUrl ??
    r.Tickets ??
    r.kaartjies_url ??
    r.buy_tickets ??
    r.buy_url ??
    r.url ??
    null
  );
}

function resolveVenue(r: any) {
  const slug = String(getVenueSlug(r) || "").toLowerCase();
  const name = String(getVenueName(r) || "");

  // Prefer exact slug match
  if (slug && venuesBySlug[slug]) {
    const v = venuesBySlug[slug];
    return {
      label: v.name || name || slug.replace(/-/g, " "),
      mapUrl:
        typeof v.lat === "number" && typeof v.lng === "number"
          ? formatMapLink(v.lat, v.lng, v.name)
          : formatMapLink(v.slug || v.name || name || slug),
    };
  }

  // Try name match
  if (name) {
    const v = venuesByName[name.toLowerCase()];
    if (v) {
      return {
        label: v.name,
        mapUrl:
          typeof v.lat === "number" && typeof v.lng === "number"
            ? formatMapLink(v.lat, v.lng, v.name)
            : formatMapLink(v.slug || v.name),
      };
    }
    // No DB match → still give a useful search link
    return { label: name, mapUrl: formatMapLink(name) };
  }

  // Fallbacks
  if (slug) return { label: slug.replace(/-/g, " "), mapUrl: formatMapLink(slug) };
  return { label: "Venue", mapUrl: "https://www.google.com/maps" };
}

function openUrl(url: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  } else {
    Linking.openURL(url);
  }
}

// ---------- Types & normalization ----------
type EventItem = {
  id: string | number;
  title: string;
  description: string;
  venueLabel: string;
  venueMapUrl: string;
  ticketsUrl: string | null;
};

function mapRow(r: any, i: number): EventItem {
  const { label, mapUrl } = resolveVenue(r);
  return {
    id: r.id ?? i,
    title: getTitle(r, i),
    description: getDescription(r),
    venueLabel: label,
    venueMapUrl: mapUrl,
    ticketsUrl: coerceUrl(getTicketsUrl(r)),
  };
}

// ---------- Component ----------
export default function Schedule() {
  const items = useMemo<EventItem[]>(
    () => (Array.isArray(rawProgramme) ? rawProgramme.map(mapRow) : []),
    []
  );

  return (
    <ScreenShell title="Program" scroll={false}>
      {items.length === 0 ? (
        <Card style={
