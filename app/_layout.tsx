import { Stack } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";
import { useMemo } from "react";
import { palette } from "\./theme/colors";

const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.coral,             // brand coral
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

    error: "#B3261E",
    onError: palette.white,
  },
};

export default function RootLayout() {
  // memo just to avoid re-renders
  const paperTheme = useMemo(() => theme, []);
  return (
    <PaperProvider theme={paperTheme}>
      {/* Keep header hidden; we'll place a custom BrandHeader inside screens */}
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
