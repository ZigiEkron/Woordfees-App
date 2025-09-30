import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import BrandHeader from "../../components/BrandHeader"; // <-- root/components

export default function ScreenShell({
  title,
  children,
  scroll = true,
}: {
  title: string;
  children: ReactNode;
  scroll?: boolean; // set false when you use your own FlatList
}) {
  const { colors } = useTheme();
  const Body = scroll ? ScrollView : View;

  return (
    <Body style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader title={title
@'
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import BrandHeader from "../../components/BrandHeader"; // <-- root/components

export default function ScreenShell({
  title,
  children,
  scroll = true,
}: {
  title: string;
  children: ReactNode;
  scroll?: boolean; // set false when you use your own FlatList
}) {
  const { colors } = useTheme();
  const Body = scroll ? ScrollView : View;

  return (
    <Body style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader title={title} />
      <View style={{ padding: 16 }}>{children}</View>
    </Body>
  );
}
