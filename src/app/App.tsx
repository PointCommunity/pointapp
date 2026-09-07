import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function App() {
  const { height, width } = useWindowDimensions();
  const isShort = height < 500;
  const isWide = width >= 600 && !isShort;

  return (
    <SafeAreaView style={[styles.screen, isShort && styles.screenShort]}>
      <StatusBar style="light" />
      <View style={[styles.card, isWide && styles.cardWide, isShort && styles.cardShort]}>
        <Text style={[styles.eyebrow, isShort && styles.eyebrowShort]}>POINTAPP</Text>
        <Text accessibilityRole="header" style={[styles.title, isWide && styles.titleWide]}>
          Point Community Church
        </Text>
        <Text style={[styles.body, isShort && styles.bodyShort]}>
          A durable home for worship, community, and what comes next.
        </Text>
        <View
          accessible
          accessibilityLabel="Bundled foundation ready"
          style={[styles.statusRow, isShort && styles.statusRowShort]}
        >
          <View accessibilityElementsHidden style={styles.statusDot} />
          <Text style={styles.statusText}>Bundled foundation ready</Text>
        </View>
        <Text style={[styles.detail, isShort && styles.detailShort]}>
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
  screenShort: {
    paddingVertical: 16,
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
  cardShort: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  eyebrow: {
    marginBottom: 18,
    color: "#55D6E8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.4,
  },
  eyebrowShort: {
    marginBottom: 12,
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
  bodyShort: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 26,
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
  statusRowShort: {
    marginTop: 18,
    paddingVertical: 8,
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
  detailShort: {
    marginTop: 16,
  },
});
