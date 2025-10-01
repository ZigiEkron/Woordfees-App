// app/components/ScreenShell.tsx
import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";

type Props = PropsWithChildren<{ title?: string; scroll?: boolean }>;

export default function ScreenShell({ title, scroll = true, children }: Props) {
  const Content = (
    <View style={styles.inner}>
      {!!title && <Text variant="titleLarge" style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
  return scroll ? <ScrollView style={styles.page}>{Content}</ScrollView> : <View style={styles.page}>{Content}</View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFF" },
  inner: { padding: 16, paddingBottom: 32, gap: 12 },
  title: { fontWeight: "700", color: "#1B5E20", marginBottom: 4 },
});
