import { Stack, Link } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { loadEvents } from "./lib/events";
import { venueLabel, mapsUrl } from "./lib/venues";

function clean(v?: any) {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  // treat common junk as empty
  if (s.toLowerCase() === "nan" || s.toLowerCase() === "null" || s === "undefined") return undefined;
  return s;
}

function joinParts(parts: (string | undefined)[], sep = " · ") {
  return parts.filter(Boolean).join(sep);
}

export default function Schedule() {
  const events = loadEvents();

  return (
    <View style={{ padding: 16 }}>
      <Stack.Screen options={{ title: "Program" }} />
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Program</Text>

      <ScrollView>
        {events.map((ev, i) => {
          const id = String(ev.id ?? i);
          const title = clean(ev.title) ?? "Untitled";
          const venue = venueLabel(ev);               // shows "Onbekende venue" if unknown
          const when = joinParts([clean(ev.date), clean(ev.time)]);
          const murl = mapsUrl(ev);                   // only if venue can be resolved
          const tickets = clean(ev.ticketsUrl);

          return (
            <View key={id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee", gap: 6 }}>
              {/* Title: internal detail if you have it; otherwise external detailUrl if present */}
              {clean(ev.detailUrl) ? (
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  <a href={String(ev.detailUrl)} target="_blank" rel="noreferrer">{title}</a>
                </Text>
              ) : (
                <Link href={`/event/${encodeURIComponent(id)}`}>
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>{title}</Text>
                </Link>
              )}

              {/* Meta line(s) – never render raw NaN */}
              <Text style={{ color: "#666" }}>• {venue}</Text>
              {when && <Text style={{ color: "#666" }}>• {when}</Text>}

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                {tickets && (
                  <a
                    href={tickets}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "6px 10px", borderRadius: 8, background: "#1e40af", color: "white", fontSize: 12 }}
                  >
                    Koop kaartjies
                  </a>
                )}
                {murl && (
                  <a href={murl} target="_blank" rel="noreferrer" style={{ color: "#1a73e8", fontWeight: 600 }}>
                    Wys op kaart
                  </a>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
