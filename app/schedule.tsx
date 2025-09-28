// app/schedule.tsx
import { Stack, Link } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { loadEvents } from "./lib/events";
import { venueLabel, mapsUrl } from "./lib/venues";

// Helper to clean text
function clean(s?: string | null) {
  if (!s) return undefined;
  const t = String(s).replace(/\s+/g, " ").trim();
  return t && t.toLowerCase() !== "nan" ? t : undefined;
}

export default function Schedule() {
  const events = loadEvents();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Stack.Screen options={{ title: "Program" }} />

      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 4 }}>
        Program
      </Text>

      {events.map((ev) => {
        const vLabel = venueLabel(ev.venueName, ev.venueSlug);
        const blurbFull = clean(ev.description);
        const blurb =
          blurbFull && blurbFull.length > 850
            ? blurbFull.slice(0, 850) + "…"
            : blurbFull;

        return (
          <View
            key={ev.id}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              gap: 6,
            }}
          >
            {/* Event title */}
            <Link
              href={{ pathname: "/event/[id]", params: { id: String(ev.id) } }}
              style={{
                color: "#1138c7",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {ev.title}
            </Link>

            {/* Venue and map link */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ color: "#555" }}>
                • {vLabel ?? "Onbekende venue"}
              </Text>
              {(ev.venueSlug || ev.venueName) && (
                <Link
                  href={mapsUrl(ev.venueSlug, ev.venueName)}
                  target="_blank"
                  style={{
                    fontSize: 12,
                    backgroundColor: "#1138c7",
                    color: "#fff",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  Wys op kaart
                </Link>
              )}
            </View>

            {/* Event description */}
            {blurb && (
              <Text style={{ color: "#333", lineHeight: 20 }}>{blurb}</Text>
            )}

            {/* Ticket link */}
            {ev.ticketsUrl && (
              <TouchableOpacity>
                <Link
                  href={ev.ticketsUrl}
                  target="_blank"
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 12,
                    backgroundColor: "#1138c7",
                    color: "#fff",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginTop: 4,
                  }}
                >
                  Koop kaartjies
                </Link>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
