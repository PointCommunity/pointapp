import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.card, isWide && styles.cardWide]}>
        <Text style={styles.eyebrow}>POINTAPP</Text>
        <Text accessibilityRole="header" style={[styles.title, isWide && styles.titleWide]}>
          Point Community Church
        </Text>
        <Text style={styles.body}>
          A durable home for worship, community, and what comes next.
        </Text>
        <View accessible accessibilityLabel="Bundled foundation ready" style={styles.statusRow}>
          <View accessibilityElementsHidden style={styles.statusDot} />
          <Text style={styles.statusText}>Bundled foundation ready</Text>
        </View>
        <Text style={styles.detail}>
          This screen ships inside the app. Builder configuration will arrive through a
          validated, versioned data contract in a later release.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071019",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    padding: 28,
    borderWidth: 1,
    borderColor: "#294155",
    borderRadius: 24,
    backgroundColor: "#111D28",
  },
  cardWide: {
    padding: 48,
  },
  eyebrow: {
    marginBottom: 18,
    color: "#55D6E8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.4,
  },
  title: {
    color: "#F4F7FA",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  titleWide: {
    fontSize: 54,
    lineHeight: 58,
  },
  body: {
    maxWidth: 560,
    marginTop: 18,
    color: "#C7D3DC",
    fontSize: 20,
    lineHeight: 30,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    marginTop: 32,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#17362D",
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#74E0AA",
  },
  statusText: {
    color: "#A7F0CC",
    fontSize: 15,
    fontWeight: "700",
  },
  detail: {
    maxWidth: 580,
    marginTop: 24,
    color: "#91A5B5",
    fontSize: 15,
    lineHeight: 23,
  },
});
