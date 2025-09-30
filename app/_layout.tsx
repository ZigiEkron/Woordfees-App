// app/_layout.tsx
import { Stack } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";
import { useMemo } from "react";

// Woordfees + Netwerk24 brand palette
const palette = {
  coral: "#FF8B82",
  coralDark: "#FF6F66",
  coralLight: "#FFD6D2",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceVariant: "#F6F6F6",
  outline: "#E6E6E6",
  textPrimary: "#1E1E1E",
};

const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.coral,
    onPrimary: palette.white,
    primaryContainer: palette.coralLight,
    onPrimaryContainer: palette.textPrimary,

    secondary: palette.coralDark,
    onSecondary: palette.white,
    secondaryContainer: palette.coralLight,
    onSecondaryContainer: palette.textPrimary,

    background: palette.offWhite,
    onBackground: palette.textPrimary,
    surface: palette.surface,
    onSurface: palette.textPrimary,
    surfaceVariant: palette.surfaceVariant,
    outline: palette.outline,

    // keep default error/success etc. from DefaultTheme unless you want to brand them too
  },
};

export default function RootLayout() {
  const paperTheme = useMemo(() => theme, []);
  return (
    <PaperProvider theme={paperTheme}>
      {/* We hide the native header because every screen uses our BrandHeader via ScreenShell */}
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
