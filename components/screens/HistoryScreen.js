import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useHistory } from "../context/HistoryContext";

export default function HistoryScreen() {
  const { history, loading } = useHistory();

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak historii transakcji</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
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

          <Text style={styles.rate}>
            Kurs: {Number(item.rate).toFixed(4)}
          </Text>

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
  },
});

