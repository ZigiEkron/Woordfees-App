import { View, Image, Text } from "react-native";
import { useTheme } from "react-native-paper";

export default function BrandHeader({ title = "Woordfees" }: { title?: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        paddingTop: 18,
        paddingBottom: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Image
        source={require("../assets/logos/woordfees.png")}
        style={{ width: 34, height: 34, resizeMode: "contain" }}
      />
      <View>
        <Text
          style={{
            color: colors.onPrimary,
            fontSize: 20,
            fontWeight: "700",
            letterSpacing: 0.4,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.onPrimary,
            opacity: 0.85,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          Toyota US Woordfees
        </Text>
      </View>
    </View>
  );
}
