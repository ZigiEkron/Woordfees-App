import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Optional heading */}
      <Text style={styles.heading}>Woordfees Programme</Text>

      {/* Three vertically stacked tabs */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/schedule")}
      >
        <Text style={styles.tabText}>Programme</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/venues")}
      >
        <Text style={styles.tabText}>Venues</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.tabText}>Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center", // Centers horizontally
    justifyContent: "center", // Centers vertically
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 32,
    textAlign: "center",
  },
  tabButton: {
    backgroundColor: "#FF7E79",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
    width: "70%", // keeps consistent button width
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
});
