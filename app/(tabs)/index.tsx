// app/(tabs)/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const goSearch = () => {
    if (!query.trim()) {
      router.push("/schedule");
      return;
    }
    // Pass query to schedule page (or your search route if you add one)
    router.push({ pathname: "/schedule", params: { q: query.trim() } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <View style={styles.container}>
        <Text style={styles.heading}>Woordfees Programme</Text>

        {/* Search box */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Soek programme, venues of kaartjies…"
          style={styles.search}
          returnKeyType="search"
          onSubmitEditing={goSearch}
        />

        {/* Buttons stacked vertically & centered */}
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/schedule")}>
          <Text style={styles.tabText}>Programme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/venues")}>
          <Text style={styles.tabText}>Venues</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/map")}>
          <Text style={styles.tabText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabButton, styles.hollow]} onPress={() => router.push("/tickets")}>
          <Text style={[styles.tabText, styles.hollowText]}>Kaartjies</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",         // center horizontally
    justifyContent: "center",     // center vertically
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 20,
    textAlign: "center",
  },
  search: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#FF7E79",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: "#FF7E79",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  hollow: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF7E79",
  },
  hollowText: {
    color: "#FF7E79",
  },
});
