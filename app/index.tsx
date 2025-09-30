// app/index.tsx
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link } from "expo-router";
import ScreenShell from "./components/ScreenShell";

export default function Home() {
  return (
    <ScreenShell title="Woordfees" scroll={false}>
      <View style={{ gap: 16, paddingTop: 8 }}>
        <Text variant="titleLarge" style={{ fontWeight: "800", marginBottom: 2 }}>
          Kies ’n skerm om voort te gaan:
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <Link href="/schedule" asChild>
            <Button mode="contained">Program</Button>
          </Link>

          <Link href="/map" asChild>
            <Button mode="outlined">Venues / Kaart</Button>
          </Link>

          <Link href="/tickets" asChild>
            <Button mode="outlined">Kaartjies</Button>
          </Link>
        </View>
      </View>
    </ScreenShell>
  );
}
