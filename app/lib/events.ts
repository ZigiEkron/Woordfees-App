// app/lib/events.ts
export type EventItem = {
  id: string;
  title: string;
  description?: string;
  category?: string | null;
  language?: string | null;
  priceText?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  date?: string | null;
  time?: string | null;
  detailUrl?: string;
  ticketsUrl?: string;
  venueName?: string | null;
  venueSlug?: string | null;
};

type Raw = any;

const asStr = (v: unknown) => {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s && s.toLowerCase() !== "nan" ? s : undefined;
};
const asNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function coerce(r: Raw): EventItem {
  // works with programme.enriched.json / programme.json / programme.min.json / programme.slim.json
  const description =
    asStr(r.description) ??
    asStr(r.Description); // just in case

  return {
    id: String(r.id ?? cryptoId()),
    title: asStr(r.title) ?? "Untitled",
    description,

    category: asStr(r.category) ?? null,
    language: asStr(r.language) ?? null,

    priceText: asStr(r.price_text) ?? asStr(r.priceText) ?? null,
    priceMin: asNum(r.price_min) ?? asNum(r.priceMin) ?? undefined,
    priceMax: asNum(r.price_max) ?? asNum(r.priceMax) ?? undefined,

    date: asStr(r.date) ?? null,
    time: asStr(r.time) ?? null,

    detailUrl: asStr(r.detailUrl) ?? asStr(r.detail_url),
    ticketsUrl: asStr(r.ticketsUrl) ?? asStr(r.tickets_url),

    venueName: asStr(r.venue_name) ?? asStr(r.venueName) ?? null,
    venueSlug: asStr(r.venue_slug) ?? asStr(r.venueSlug) ?? null,
  };
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}

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
  return (data ?? []).map(coerce);
}
