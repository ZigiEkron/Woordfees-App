import React from "react";
import { Stack } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import BrandHeader from "../components/BrandHeader";

const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF7E79",  // Woordfees coral color
    secondary: "#1B5E20", // Deep green accent
    background: "#FFFFFF",
    surface: "#FFFFFF",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.root}>
        <BrandHeader />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
