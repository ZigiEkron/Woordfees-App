import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logos/woordfees.png")}
          style={styles.woordfeesLogo}
        />
        <Image
          source={require("../assets/logos/netwerk24.png")}
          style={styles.netwerkLogo}
        />
      </View>
      <Text style={styles.subtitle}>Toyota US Woordfees</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FF7E79",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  woordfeesLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  netwerkLogo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
