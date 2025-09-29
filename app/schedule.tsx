// app/schedule.tsx
import { ScrollView, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import BrandHeader from "../components/BrandHeader";
import { formatMapLink } from "./lib/venues"; // our flexible helper

// --- build-time data imports so GitHub Pages works ---
const rawProgramme = require("./assets/programme.json") as any[];
const rawVenues = require("./assets/venues.json") as Array<{
  slug?: string;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
}>;

// Build quick lookup by slug and by lowercased name
const venuesBySlug = Object.fromEntries(
  rawVenues
    .filter((v) => v.slug)
    .map((v) => [String(v.slug).toLowerCase(), v])
);
const venuesByName = Object.fromEntries(
  rawVenues.map((v) => [String(v.name).toLowerCase(), v])
);

// Helpers to normalize fields coming from different CSVs/JSONs
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
function coerceUrl(u: any): string | null {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  // sometimes data holds a path; try to make it absolute
  return `https://woordfees.co.za/${s.replace(/^\/+/, "")}`;
}

// Make a friendly venue label and a maps URL
function resolveVenue(r: any) {
  const slug = String(getVenueSlug(r) || "").toLowerCase();
  const name = String(getVenueName(r) || "");

  // Prefer exact slug hit
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
    // No DB match, still provide a usable search link
    return { label: name, mapUrl: formatMapLink(name) };
  }

  // Fallback: use slug text
  if (slug) {
    return { label: slug.replace(/-/g, " "), mapUrl: formatMapLink(slug) };
  }

  return { label: "Venue", mapUrl: "https://www.google.com/maps" };
}

type EventItem = {
  id: string | number;
  title: string;
  description: string;
  venueLabel: string;
  venueMapUrl: string;
  ticketsUrl: string | null;
};

// Normalize the programme rows
const events: EventItem[] = (Array.isArray(rawProgramme) ? rawProgramme : []).map(
  (r: any, i: number) => {
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
);

export default function Schedule() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <BrandHeader title="Program" />

      <View style={{ padding: 16, gap: 16 }}>
        {events.length === 0 && (
          <Card style={{ borderRadius: 16 }}>
            <Card.Content>
              <Text variant="titleSmall" style={{ marginBottom: 6 }}>
                Geen items om te wys nie
              </Text>
              <Text variant="bodySmall">
                Kontroleer asseblief <Text style={{ fontWeight: "700" }}>app/assets/programme.json</Text> en{" "}
                <Text style={{ fontWeight: "700" }}>app/assets/venues.json</Text>.
              </Text>
            </Card.Content>
          </Card>
        )}

        {events.map((ev) => (
          <Card key={ev.id} style={{ borderRadius: 16, backgroundColor: "white", elevation: 2 }}>
            <Card.Content style={{ paddingBottom: 4 }}>
              <Text
                variant="titleMedium"
                style={{ fontWeight: "700", color: "#FF6F66", marginBottom: 4 }}
              >
                {ev.title}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontStyle: "italic", opacity: 0.75, marginBottom: 6 }}
              >
                {ev.venueLabel}
              </Text>
              {!!ev.description && (
                <Text variant="bodySmall" style={{ color: "#333", lineHeight: 20 }}>
                  {ev.description}
                </Text>
              )}
            </Card.Content>

            <Card.Actions style={{ justifyContent: "flex-end", gap: 8 }}>
              <Button
                mode="outlined"
                onPress={() => window.open(ev.venueMapUrl, "_blank")}
              >
                Kaart
              </Button>

              {!!ev.ticketsUrl && (
                <Button
                  mode="contained"
                  buttonColor="#FF8B82"
                  textColor="white"
                  onPress={() => window.open(ev.ticketsUrl!, "_blank")}
                >
                  Koop kaartjies
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
