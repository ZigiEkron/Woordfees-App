/** lib/venues.ts */

type Venue = {
  slug?: string;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
};
export type VenueMap = Record<string, Venue>;

/** Overloads: */
export function formatMapLink(slugOrName: string): string;
export function formatMapLink(lat: number, lng: number, name?: string): string;
/** Implementation: */
export function formatMapLink(a: any, b?: any, c?: any): string {
  if (typeof a === "number" && typeof b === "number") {
    const lat = a as number;
    const lng = b as number;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const key = (c || a || "").toString();
  const q = encodeURIComponent(key.replace(/-/g, " ").trim() || "Stellenbosch");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function mapsUrl(slug?: string, name?: string): string {
  const key = (slug || name || "").trim();
  if (!key) return "https://www.google.com/maps";
  return formatMapLink(key);
}

export function venueLabel(name: string, slug?: string): string {
  if (name && name.trim().length > 0) return name;
  if (slug && slug.trim().length > 0) return slug.replace(/-/g, " ");
  return "Venue";
}

/** Load venues bundled as JSON (from repo root: lib -> app/assets/venues.json) */
export async function loadVenues(): Promise<VenueMap> {
  const data = require("../app/assets/venues.json") as Venue[];
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
