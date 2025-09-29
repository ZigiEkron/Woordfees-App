// app/schedule.tsx
import { ScrollView, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import BrandHeader from "../components/BrandHeader";

// --- Import the data at build-time so it works on GitHub Pages ---
let raw: any;
try {
  raw = require("./assets/programme.json"); // from app/ -> app/assets/programme.json
} catch (e) {
  try {
    raw = require("../assets/programme.json"); // fallback (repo-root assets/, if you ever move it)
  } catch {
    raw = [];
  }
}

// Accept a variety of shapes: array or {data|rows|items|events}
const rows: any[] = Array.isArray(raw)
  ? raw
  : (raw?.data ?? raw?.rows ?? raw?.items ?? raw?.events ?? []);

// Normalise row fields to what we render
type Row = {
  id?: string | number;
  title?: string;
  Produksie?: string;
  description?: string;
  Info?: string;
  Venue?: string;
  venueName?: string;
  tickets_url?: string;
  ticket_url?: string;
};

const events = rows.map((r: Row, i: number) => ({
  id: r.id ?? i,
  title: r.title ?? r.Produksie ?? "Onbekende titel",
  description: r.description ?? r.Info ?? "",
  venueName: r.venueName ?? r.Venue ?? "Venue",
  tickets_url: r.tickets_url ?? r.ticket_url ?? null,
}));

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
                Kon nie <Text style={{ fontWeight: "700" }}>app/assets/programme.json</Text> lees nie.
                Maak seker die lêer is ge-commit en het ’n geldige struktuur.
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
              <Text variant="bodyMedium" style={{ fontStyle: "italic", opacity: 0.7, marginBottom: 6 }}>
                {ev.venueName}
              </Text>
              {!!ev.description && (
                <Text variant="bodySmall" style={{ color: "#333", lineHeight: 20 }}>
                  {ev.description}
                </Text>
              )}
            </Card.Content>

            <Card.Actions style={{ justifyContent: "flex-end" }}>
              {!!ev.tickets_url && (
                <Button
                  mode="contained"
                  buttonColor="#FF8B82"
                  textColor="white"
                  onPress={() => window.open(ev.tickets_url!, "_blank")}
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
