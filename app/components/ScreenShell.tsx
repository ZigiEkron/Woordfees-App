// app/components/ScreenShell.tsx
import React, { ReactNode } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import BrandHeader from "../../components/BrandHeader"; // Header lives at repo-root/components

type Props = {
  title: string;
  children: ReactNode;
  /** Set false if the screen renders its own FlatList (so it controls scrolling). */
  scroll?: boolean;
  /** Optional extra styles for the inner content container. */
  contentStyle?: ViewStyle;
};

export default function ScreenShell({
  title,
  children,
  scroll = true,
  contentStyle,
}: Props) {
  const { colors } = useTheme();
  const Body: any = scroll ? ScrollView : View;

  return (
    <Body style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader title={title} />
      <View style={[{ padding: 16 }, contentStyle]}>{children}</View>
    </Body>
  );
}
