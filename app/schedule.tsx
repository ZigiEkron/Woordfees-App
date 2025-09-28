import { ScrollView, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import BrandHeader from "../components/BrandHeader";

export default function Schedule({ events = [] }) {
  // If your events come via props or context, keep that logic.
  // Otherwise, replace this with your existing event loading code.

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <BrandHeader title="Program" />

      <View style={{ padding: 16, gap: 16 }}>
        {events.map((ev, idx) => (
          <Card
            key={idx}
            style={{
              borderRadius: 16,
              backgroundColor: "white",
              elevation: 2,
            }}
          >
            <Card.Content style={{ paddingBottom: 4 }}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "700",
                  color: "#FF6F66", // coralDark
                  marginBottom: 4,
                }}
              >
                {ev.title || ev.Produksie}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  fontStyle: "italic",
                  opacity: 0.7,
                  marginBottom: 6,
                }}
              >
                {ev.venueName || ev.Venue || "Venue"}
              </Text>
              <Text variant="bodySmall" style={{ color: "#333", lineHeight: 20 }}>
                {ev.description || ev.Info || ""}
              </Text>
            </Card.Content>

            <Card.Actions style={{ justifyContent: "flex-end" }}>
              {ev.tickets_url && (
                <Button
                  mode="contained"
                  buttonColor="#FF8B82"
                  textColor="white"
                  onPress={() => window.open(ev.tickets_url, "_blank")}
                >
                  Koop kaartjies
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
