import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Woordfees</Text>
      <Text style={styles.sub}>Kies ’n skerm om voort te gaan:</Text>

      <View style={styles.buttons}>
        <Link href="/schedule" asChild>
          <Pressable style={styles.btn}><Text style={styles.btnText}>Program</Text></Pressable>
        </Link>
        <Link href="/map" asChild>
          <Pressable style={styles.btn}><Text style={styles.btnText}>Venues / Kaart</Text></Pressable>
        </Link>
        <Link href="/tickets" asChild>
          <Pressable style={styles.btn}><Text style={styles.btnText}>Kaartjies</Text></Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "800" },
  sub: { color: "#6B7280" },
  buttons: { flexDirection: "row", gap: 12, marginTop: 10, flexWrap: "wrap", justifyContent: "center" },
  btn: { backgroundColor: "#F59E0B", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnText: { color: "#111827", fontWeight: "700" }
});
