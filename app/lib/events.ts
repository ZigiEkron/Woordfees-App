// app/lib/events.ts

// ---- Types -----------------------------------------------------------------

export type EventItem = {
  id: string;
  title: string;

  // When available
  description?: string;

  // Optional categorization / metadata
  category?: string | null;
  language?: string | null;

  // Price info (text or min/max if present in source)
  priceText?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;

  // Date/time as given in source (best-effort)
  date?: string | null;  // e.g. "2025-10-10" or "10 Oct 2025"
  time?: string | null;  // e.g. "19:00"

  // Normalized best-effort start timestamp (ISO). May be undefined if parsing fails.
  startISO?: string;

  // Useful external links (kept, but you don't have to send users online)
  detailUrl?: string;
  ticketsUrl?: string;

  // Venue hints (resolver in lib/venues can use these)
  venueName?: string | null;
  venueSlug?: string | null;
};

// ---- Internal helpers ------------------------------------------------------

type Raw = any;

function asString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function asNumber(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Very tolerant date/time → ISO parser. Returns undefined if it can't reasonably parse. */
function toISO(date?: string | null, time?: string | null): string | undefined {
  const d = asString(date);
  const t = asString(time);

  if (!d && !t) return undefined;

  // Try various combinations: "YYYY-MM-DD", "DD Mon YYYY", etc.
  // We avoid heavy libs to keep bundle size small; rely on Date parsing heuristics.
  // If parsing fails, return undefined.
  const candidates: string[] = [];

  if (d && t) candidates.push(`${d} ${t}`);
  if (d) candidates.push(d);
  if (t) candidates.push(t); // unlikely to parse alone, but harmless to try

  for (const c of candidates) {
    const dt = new Date(c);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }

  // Last-ditch: if date looks like YYYY-MM-DD, treat as local midnight.
  if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const dt = new Date(`${d}T00:00:00`);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }

  return undefined;
}

/** Normalize a single raw event row into our EventItem shape. */
function coerce(r: Raw): EventItem {
  // Shape A: programme.min.json  (camelCase, has detailUrl/ticketsUrl, often venueSlug)
  if ("detailUrl" in r || "ticketsUrl" in r) {
    const date = asString(r.date) ?? null;
    const time = asString(r.time) ?? null;

    return {
      id: String(r.id),
      title: asString(r.title) ?? "Untitled",
      description: asString(r.description),

      category: asString(r.category) ?? null,
      language: asString(r.language) ?? null,

      priceText: asString(r.price_text) ?? asString(r.priceText) ?? null,
      priceMin: asNumber(r.price_min) ?? asNumber(r.priceMin) ?? null,
      priceMax: asNumber(r.price_max) ?? asNumber(r.priceMax) ?? null,

      date,
      time,
      startISO: toISO(date ?? undefined, time ?? undefined),

      detailUrl: asString(r.detailUrl),
      ticketsUrl: asString(r.ticketsUrl),

      venueName: asString(r.venue_name) ?? asString(r.venueName) ?? null,
      venueSlug: (r.venueSlug ?? r.venue_slug ?? null) ? String(r.venueSlug ?? r.venue_slug) : null,
    };
  }

  // Shape B: programme.json  (snake_case fields like detail_url, tickets_url, venue_name)
  if ("detail_url" in r || "tickets_url" in r || "venue_name" in r) {
    const date = asString(r.date) ?? null;
    const time = asString(r.time) ?? null;

    return {
      id: String(r.id),
      title: asString(r.title) ?? "Untitled",
      description: asString(r.description),

      category: asString(r.category) ?? null,
      language: asString(r.language) ?? null,

      priceText: asString(r.price_text) ?? null,
      priceMin: asNumber(r.price_min) ?? null,
      priceMax: asNumber(r.price_max) ?? null,

      date,
      time,
      startISO: toISO(date ?? undefined, time ?? undefined),

      detailUrl: asString(r.detail_url),
      ticketsUrl: asString(r.tickets_url),

      venueName: asString(r.venue_name) ?? null,
      venueSlug: (r.venue_slug ?? null) ? String(r.venue_slug) : null,
    };
  }

  // Shape C: programme.slim.json  (links.detail, links.tickets, venue { name, slug })
  if ("links" in r || "venue" in r) {
    const date = asString(r.date) ?? null;
    const time = asString(r.time) ?? null;

    return {
      id: String(r.id),
      title: asString(r.title) ?? "Untitled",
      description: asString(r.description),

      category: asString(r.category) ?? null,
      language: asString(r.language) ?? null,

      priceText: asString(r.price_text) ?? null,
      priceMin: asNumber(r.price_min) ?? null,
      priceMax: asNumber(r.price_max) ?? null,

      date,
      time,
      startISO: toISO(date ?? undefined, time ?? undefined),

      detailUrl: asString(r?.links?.detail),
      ticketsUrl: asString(r?.links?.tickets),

      venueName: asString(r?.venue?.name) ?? null,
      venueSlug: (r?.venue?.slug ?? null) ? String(r.venue.slug) : null,
    };
  }

  // Fallback: minimal
  const date = asString(r.date) ?? null;
  const time = asString(r.time) ?? null;
  return {
    id: String(r.id ?? cryptoRandomId()),
    title: asString(r.title) ?? "Untitled",
    description: asString(r.description),

    category: asString(r.category) ?? null,
    language: asString(r.language) ?? null,

    priceText: asString(r.price_text) ?? null,
    priceMin: asNumber(r.price_min) ?? null,
    priceMax: asNumber(r.price_max) ?? null,

    date,
    time,
    startISO: toISO(date ?? undefined, time ?? undefined),

    detailUrl: asString((r.detailUrl ?? r.detail_url) as string | undefined),
    ticketsUrl: asString((r.ticketsUrl ?? r.tickets_url) as string | undefined),

    venueName: asString((r.venueName ?? r.venue_name) as string | undefined) ?? null,
    venueSlug: (r.venueSlug ?? r.venue_slug ?? null) ? String(r.venueSlug ?? r.venue_slug) : null,
  };
}

function cryptoRandomId(): string {
  // Small helper to avoid pulling a crypto polyfill on web export
  return Math.random().toString(36).slice(2, 10);
}

// ---- Public API ------------------------------------------------------------

/**
 * Load events from preferred local JSON (with offline descriptions),
 * then fall back to other programme variants if missing.
 *
 * Order:
 *   1) app/assets/programme.json
 *   2) ../../programme.slim.json
 *   3) ../../programme.min.json
 *   4) ../../programme.json
 */
export function loadEvents(): EventItem[] {
  let data: Raw[] = [];

  try { data = require("../assets/programme.json"); } catch {}
  if (!Array.isArray(data) || data.length === 0) {
    try { data = require("../../programme.slim.json"); } catch {}
  }
  if (!Array.isArray(data) || data.length === 0) {
    try { data = require("../../programme.min.json"); } catch {}
  }
  if (!Array.isArray(data) || data.length === 0) {
    try { data = require("../../programme.json"); } catch {}
  }

  const events = (data ?? []).map(coerce);

  // Stable sort: earliest first if we have startISO, otherwise by title.
  events.sort((a, b) => {
    if (a.startISO && b.startISO) return a.startISO.localeCompare(b.startISO);
    if (a.startISO) return -1;
    if (b.startISO) return 1;
    return a.title.localeCompare(b.title);
  });

  // De-duplicate by id (keep first)
  const seen = new Set<string>();
  const dedup: EventItem[] = [];
  for (const ev of events) {
    if (seen.has(ev.id)) continue;
    seen.add(ev.id);
    dedup.push(ev);
  }

  return dedup;
}

/** Create a fast id → event index. */
export function indexById(list: EventItem[]): Record<string, EventItem> {
  return Object.fromEntries(list.map((e) => [e.id, e]));
}

/** Get a single event by id from a list (helper for detail screens). */
export function getEventById(list: EventItem[], id?: string | number | null): EventItem | undefined {
  if (id == null) return undefined;
  const key = String(id);
  for (const e of list) if (e.id === key) return e;
  return undefined;
}
