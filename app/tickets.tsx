// app/tickets.tsx
import { useMemo } from "react";
import { Platform, Linking, FlatList } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import ScreenShell from "./components/ScreenShell";

// Build-time import so it works on GitHub Pages
const rawProgramme = require("./assets/programme.json") as any[];

function coerceUrl(u: any): string | null {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  // turn relative paths into absolute site URLs
  return `https://woordfees.co.za/${s.replace(/^\/+/, "")}`;
}

function getTitle(r: any, i: number) {
  return r.title ?? r.Produksie ?? r.name ?? `Item ${i + 1}`;
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

type TicketItem = { id: string | number; title: string; url: string };

function mapRow(r: any, i: number): TicketItem | null {
  const url = coerceUrl(getTicketsUrl(r));
  if (!url) return null;
  return {
    id: r.id ?? i,
    title: getTitle(r, i),
    url,
  };
}

function openUrl(url: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  } else {
    Linking.openURL(url);
  }
}

export default function Tickets() {
  const items = useMemo(
    () =>
      (Array.isArray(rawProgramme) ? rawProgramme.map(mapRow).filter(Boolean) : []) as TicketItem[],
    []
  );

  return (
    <ScreenShell title="Kaartjies" scroll={false}>
      {items.length === 0 ? (
        <Card style={{ borderRadius: 16 }}>
          <Card.Content>
            <Text variant="titleSmall" style={{ marginBottom: 6 }}>
              Geen kaartjie-skakels gevind nie
            </Text>
            <Text variant="bodySmall">
              Maak seker <Text style={{ fontWeight: "700" }}>app/assets/programme.json</Text> bevat ’n
              veld soos <Text style={{ fontWeight: "700" }}>tickets_url</Text> /{" "}
              <Text style={{ fontWeight: "700" }}>ticket_url</Text> /{" "}
              <Text style={{ fontWeight: "700" }}>buy_url</Text>.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
          renderItem={({ item }) => (
            <Card style={{ borderRadius: 16, backgroundColor: "white" }}>
              <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: "700", marginBottom: 6 }}>
                  {item.title}
                </Text>
                <Button mode="contained" onPress={() => openUrl(item.url)}>
                  Koop kaartjies
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </ScreenShell>
  );
}
