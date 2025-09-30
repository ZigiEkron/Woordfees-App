import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import BrandHeader from "../../components/BrandHeader"; // BrandHeader is at repo-root/components

export default function ScreenShell({
  title,
  children,
  scroll = true,
}: {
  title: string;
  children: ReactNode;
  scroll?: boolean; // set false if the screen renders its own FlatList
}) {
  const { colors } = useTheme();
  const Body = (scroll ? ScrollView : View) as any;

  return (
    <Body style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader title={title} />
      <View style={{ padding: 16 }}>{children}</View>
    </Body>
  );
}
