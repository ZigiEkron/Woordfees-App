import { Stack, Link } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { loadEvents } from "./lib/events";
import { venueLabel, mapsUrl } from "./lib/venues";

export default function Schedule() {
  const events = loadEvents();

  return (
    <View style={{ padding: 16 }}>
      <Stack.Screen options={{ title: "Program" }} />
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Program</Text>

      <ScrollView>
        {events.map((ev, i) => {
          const id = ev.id || String(i);
          const murl = mapsUrl(ev);
          return (
            <View key={id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee", gap: 6 }}>
              {/* Title → event detail if you have a local screen, else external Woordfees detailUrl */}
              {ev.detailUrl ? (
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  <a href={ev.detailUrl} target="_blank" rel="noreferrer">{ev.title}</a>
                </Text>
              ) : (
                <Link href={`/event/${encodeURIComponent(id)}`}>
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>{ev.title}</Text>
                </Link>
              )}

              {/* Venue + map link */}
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <Text style={{ color: "#666" }}>• {venueLabel(ev)}</Text>
                {murl && (
                  <a href={murl} target="_blank" rel="noreferrer" style={{ color: "#1a73e8" }}>
                    Wys op kaart
                  </a>
                )}
              </View>

              {/* Tickets (if present) */}
              {ev.ticketsUrl && (
                <View>
                  <a href={ev.ticketsUrl} target="_blank" rel="noreferrer"
                    style={{ padding: "6px 10px", borderRadius: 8, background: "#1e40af", color: "white", fontSize: 12 }}>
                    Koop kaartjies
                  </a>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
