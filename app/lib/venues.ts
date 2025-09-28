/** app/lib/venues.ts */

type Venue = {
  slug?: string;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
};

type VenueMap = Record<string, Venue>;

/** Build a Google Maps URL from a slug or name. */
export function formatMapLink(slugOrName: string): string {
  const q = encodeURIComponent(slugOrName.replace(/-/g, " "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Convenience used in schedule.tsx – accepts (slug?, name?) like your calls do. */
export function mapsUrl(slug?: string, name?: string): string {
  const key = (slug || name || "").trim();
  if (!key) return "https://www.google.com/maps";
  return formatMapLink(key);
}

/** Pretty label used in schedule.tsx – accepts (name, slug?) like your calls do. */
export function venueLabel(name: string, slug?: string): string {
  if (name && name.trim().length > 0) return name;
  if (slug && slug.trim().length > 0) return slug.replace(/-/g, " ");
  return "Venue";
}

/**
 * Load venues from assets/venues.json and return a map keyed by slug (if present),
 * otherwise by lowercased name.
 */
export async function loadVenues(): Promise<VenueMap> {
  // Static import works in Expo web build for JSON in assets/
  const data = require("../assets/venues.json") as Venue[]; // relative to app/lib/venues.ts -> app/assets/venues.json
  const map: VenueMap = {};
  for (const v of data) {
    const key =
      (v.slug && v.slug.toLowerCase()) ||
      (v.name && v.name.toLowerCase());
    if (!key) continue;
    map[key] = v;
  }
  return map;
}
