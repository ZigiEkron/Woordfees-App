import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Linking, TextInput, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import programme from "./programme.json";

interface EventItem {
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  venue_name?: string;
  category?: string;
  description?: string;
  tickets_url?: string;
  buy_tickets_url?: string;
}

const Card: React.FC<{ item: EventItem }> = ({ item }) => {
  const url = (item.buy_tickets_url || item.tickets_url || "").trim();
  const hasUrl = url.length > 0;

  const handlePress = async () => {
    if (!hasUrl) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (e) {
      console.warn("Could not open tickets URL", e);
    }
  };

  const metaBits = [item.date, item.time].filter(Boolean).join(" · ");
  const venueText = item.venue_name || item.venue;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title || "Untitled"}</Text>
      {(metaBits || venueText) ? (
        <Text style={styles.cardMeta}>
          {metaBits}{venueText ? ` • ${venueText}` : ""}
        </Text>
      ) : null}

      <Text style={item.description ? styles.cardDesc : styles.cardDescMuted}>
        {item.description || "Geen beskrywing beskikbaar nie."}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handlePress}
          disabled={!hasUrl}
          style={[styles.button, !hasUrl && styles.buttonDisabled]}
        >
          <Text style={styles.buttonLabel}>
            {hasUrl ? "Koop kaartjies" : "Geen kaartjieskakel"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const items = (programme as EventItem[]).slice();
    const norm = (v?: string) => (v || "").toString().toLowerCase();

    const filtered = q
      ? items.filter((it) =>
          [it.title, it.description, it.venue_name, it.category]
            .map(norm)
            .some((t) => t.includes(q.toLowerCase()))
        )
      : items;

    filtered.sort((a, b) => {
      const aKey = `${a.date || ""} ${a.time || ""} ${a.title || ""}`.toLowerCase();
      const bKey = `${b.date || ""} ${b.time || ""} ${b.title || ""}`.toLowerCase();
      return aKey.localeCompare(bKey);
    });
    return filtered;
  }, [q]);

  const renderItem = ({ item }: { item: EventItem }) => <Card item={item} />;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Woordfees Program</Text>
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Soek titel, beskrywing, venue of kategorie"
            value={q}
            onChangeText={setQ}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => item.id || `${item.title}-${idx}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listPad}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6", // gray-100
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  searchWrap: {
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
  },
  listPad: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardMeta: {
    color: "#6B7280", // gray-500
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827", // gray-900
    marginBottom: 12,
  },
  cardDescMuted: {
    fontSize: 16,
    lineHeight: 22,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB", // gray-300
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});