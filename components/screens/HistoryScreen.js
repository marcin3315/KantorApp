import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTransactions } from "../context/TransactionHistoryContext";

export default function HistoryScreen() {
  const { transactions } = useTransactions();

  if (transactions.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak transakcji</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.type}>
            {item.type === "BUY" ? "Kupno" : "Sprzedaż"} 
          </Text>
          <Text>{item.amount} {item.currency} po kursie {item.rate}</Text>
          <Text>{item.total.toFixed(2)} PLN</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  type: {
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
