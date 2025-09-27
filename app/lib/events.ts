// app/lib/events.ts
type Raw = any;

export type EventItem = {
  id: string;
  title: string;
  detailUrl?: string;
  ticketsUrl?: string;
};

// Normalize across your programme files
function coerce(r: Raw): EventItem {
  // programme.min.json shape
  if ("detailUrl" in r || "ticketsUrl" in r) {
    return { id: String(r.id), title: r.title, detailUrl: r.detailUrl, ticketsUrl: r.ticketsUrl ?? undefined };
  }
  // programme.json shape
  if ("detail_url" in r || "tickets_url" in r) {
    return { id: String(r.id), title: r.title, detailUrl: r.detail_url, ticketsUrl: r.tickets_url ?? undefined };
  }
  // programme.slim.json shape
  if ("links" in r) {
    return { id: String(r.id), title: r.title, detailUrl: r.links?.detail, ticketsUrl: r.links?.tickets ?? undefined };
  }
  return { id: String(r.id ?? Math.random()), title: r.title ?? "Untitled" };
}

export function loadEvents(): EventItem[] {
  let data: Raw[] = [];
  try { data = require("../../programme.slim.json"); } catch {}
  if (!data?.length) { try { data = require("../../programme.min.json"); } catch {} }
  if (!data?.length) { try { data = require("../../programme.json"); } catch {} }
  return (data ?? []).map(coerce);
}
