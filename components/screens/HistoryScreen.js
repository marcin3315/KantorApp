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
import { useHistory } from "../context/HistoryContext";

export default function HistoryScreen() {
  const { history, loading, refresh } = useHistory();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !refreshing) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Brak historii transakcji</Text>
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
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </Text>

          <Text>
            Sprzedano: {item.sold_amount} {item.sold_currency}
          </Text>
          <Text>
            Kupiono: {item.bought_amount} {item.bought_currency}
          </Text>

          <Text style={styles.rate}>Kurs: {Number(item.rate).toFixed(4)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#666",
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
