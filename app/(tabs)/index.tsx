// app/(tabs)/index.tsx
import { useMemo } from "react";
import { FlatList } from "react-native";
import ScreenShell from "../components/ScreenShell";
import EventCard, { EventItem } from "../components/EventCard";

// Build-time import so it works on GitHub Pages
const rawProgramme = require("../assets/programme.json") as any[];

function mapRow(r: any, i: number): EventItem {
  const title =
    r.title ?? r.Produksie ?? r.name ?? `Item ${i + 1}`;
  const description =
    r.description ?? r.Info ?? r.Beskrywing ?? "";
  const venueName =
    r.venueName ?? r.Venue ?? r.venue ?? r.location ?? r.Ligging ?? "";
  const ticketsUrl =
    r.tickets_url ??
    r.ticket_url ??
    r.ticketsUrl ??
    r.Tickets ??
    r.kaartjies_url ??
    r.buy_tickets ??
    r.buy_url ??
    r.url ??
    null;

  return {
    id: r.id ?? i,
    title,
    description,
    venueLabel: venueName || "Venue",
    venueMapUrl: "", // EventCard computes/uses its own map link via helpers
    ticketsUrl: ticketsUrl ? String(ticketsUrl) : null,
    // keep any other fields EventCard uses:
    venue: r.venue ?? { lat: r.lat, lng: r.lng },
    links: { venue_map: r.venue_map },
  } as EventItem;
}

export default function EventsScreen() {
  const items = useMemo<EventItem[]>(
    () => (Array.isArray(rawProgramme) ? rawProgramme.map(mapRow) : []),
    []
  );

  return (
    // scroll={false} so FlatList controls scrolling; consistent brand header & background
    <ScreenShell title="Program" scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 24, gap: 16 }}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </ScreenShell>
  );
}
