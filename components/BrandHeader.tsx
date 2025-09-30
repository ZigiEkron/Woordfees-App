import React from "react";
import { View, Image, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function BrandHeader() {
  const { width } = useWindowDimensions();

  // Responsive scaling: shrink Netwerk24 logo slightly on small screens
  const netwerkWidth = width < 400 ? 200 : width < 600 ? 250 : 300;
  const netwerkHeight = netwerkWidth / 2.5;

  return (
    <View style={styles.header}>
      {/* Left side: Woordfees logo + tagline */}
      <View style={styles.leftContainer}>
        <Image
          source={require("../assets/logos/woordfees.png")}
          style={styles.woordfeesLogo}
        />
        <Text style={styles.subtitle}>Toyota US Woordfees</Text>
      </View>

      {/* Right side: Large Netwerk24 logo */}
      <Image
        source={require("../assets/logos/netwerk24.png")}
        style={[styles.netwerkLogo, { width: netwerkWidth, height: netwerkHeight }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FF7E79",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  woordfeesLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  netwerkLogo: {
    resizeMode: "contain",
  },
});
