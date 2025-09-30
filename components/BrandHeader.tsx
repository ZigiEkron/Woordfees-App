// components/BrandHeader.tsx
import { View, Image, Text } from "react-native";
import { useTheme } from "react-native-paper";

export default function BrandHeader({ title = "Program" }: { title?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingTop: 18, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: colors.primary }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image source={require("../assets/logos/woordfees.png")} style={{ width: 36, height: 36, resizeMode: "contain" }} />
          <View>
            <Text style={{ color: colors.onPrimary, fontSize: 20, fontWeight: "700", letterSpacing: 0.3 }}>{title}</Text>
            <Text style={{ color: colors.onPrimary, opacity: 0.85, fontSize: 12, marginTop: 2 }}>Toyota US Woordfees</Text>
          </View>
        </View>
        <Image
          source={require("../assets/logos/netwerk24.png")}
          style={{ width: 90, height: 26, resizeMode: "contain", opacity: 0.95 }}
        />
      </View>
    </View>
  );
}
