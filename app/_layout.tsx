// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";

// Custom theme based on React Native Paper's MD3LightTheme
const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1B5E20",   // Deep green
    secondary: "#C62828", // Strong red
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false, // hides the default header on all screens
        }}
      />
    </PaperProvider>
  );
}
