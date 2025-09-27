// Robust venue resolver for multiple programme shapes.
import rawVenues from "../assets/venues.json";

export type Venue = {
  slug?: string;
  name: string;
  lat?: number | null;
  lng?: number | null;
};

const venues = rawVenues as Venue[];

// Build lookups
const bySlug = new Map<string, Venue>();
const byName = new Map<string, Venue>();

function norm(s?: string) {
  return (s || "").trim().toLowerCase();
}

for (const v of venues) {
  if (v.slug) bySlug.set(norm(v.slug), v);
  byName.set(norm(v.name), v);
}

export function resolveVenue(ev: any): Venue | undefined {
  // Try slugs first (programme.min.json often has venueSlug)
  const slug =
    ev?.venueSlug ?? ev?.venue_slug ?? ev?.venue?.slug ?? ev?.venue?.id ?? ev?.venueId ?? ev?.venue_id;
  if (slug && bySlug.get(norm(String(slug)))) return bySlug.get(norm(String(slug)));

  // Try names (programme.json often has venue_name)
  const name = ev?.venue_name ?? ev?.venue?.name ?? ev?.venueName;
  if (name && byName.get(norm(String(name)))) return byName.get(norm(String(name)));

  return undefined;
}

export function venueLabel(ev: any) {
  return resolveVenue(ev)?.name ?? "Onbekende venue";
}

export function mapsUrl(ev: any) {
  const v = resolveVenue(ev);
  if (!v) return undefined;

  // Prefer precise lat/lng if present
  if (v.lat != null && v.lng != null) {
    const q = `${v.lat},${v.lng}`;
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15`;
  }
  // Fallback: search by name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}`;
}
