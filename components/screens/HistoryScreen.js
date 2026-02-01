import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useHistory } from "../context/HistoryContext";

export default function HistoryScreen() {
  const { history, loading, refresh } = useHistory();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const cardStyle = {
    backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#f2f2f2",
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={{ color: colors.text, marginTop: 12 }}>
          Ładowanie historii...
        </Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Brak historii transakcji
        </Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshBtnText}>Odśwież</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => index.toString()}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <Text style={[styles.title, { color: colors.text }]}>Kursy walut</Text>
      }
      renderItem={({ item }) => (
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.date, { color: colors.icon }]}>
            {new Date(item.created_at).toLocaleString()}
          </Text>

          <Text style={{ color: colors.text }}>
            Sprzedano: {item.sold_amount} {item.sold_currency}
          </Text>
          <Text style={{ color: colors.text }}>
            Kupiono: {item.bought_amount} {item.bought_currency}
          </Text>

          <Text style={[styles.rate, { color: colors.text }]}>
            Kurs: {Number(item.rate).toFixed(4)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    marginBottom: 6,
  },
  rate: {
    marginTop: 6,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyText: {
    marginBottom: 16,
  },
  refreshBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  refreshBtnTop: {
    alignSelf: "flex-start",
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
