export type VenueSlim = { slug: string; name: string; lat?: number|null; lng?: number|null };

let cache: Record<string, VenueSlim> | null = null;

export async function loadVenues(): Promise<Record<string, VenueSlim>> {
  if (cache) return cache;
  const res = await fetch(require("../assets/data/venues.slim.json"));
  const list: VenueSlim[] = await res.json();
  cache = Object.fromEntries(list.map(v => [v.slug, v]));
  return cache!;
}

export function formatMapLink(lat?: number|null, lng?: number|null, name?: string|null) {
  if (typeof lat === "number" && typeof lng === "number") return `https://maps.google.com/?q=${lat},${lng}`;
  return name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}` : null;
}
