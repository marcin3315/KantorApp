import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRates } from "../context/RatesContext";

function RateItem({ code, currency, buy, sell, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.currency}>{code}</Text>
      <Text style={styles.name}>{currency}</Text>

      <View style={styles.row}>
        <Text style={styles.buy}>Kup: {buy}</Text>
        <Text style={styles.sell}>Sprzedaj: {sell}</Text>
      </View>
    </TouchableOpacity>
  );
}


export default function RatesScreen() {
  const navigation = useNavigation();
  const { rates, loading, refreshRates } = useRates();

  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredRates = rates.filter(
  (r) =>
    r.code.includes(query.toUpperCase()) ||
    r.currency.toUpperCase().includes(query.toUpperCase())
);



  const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await refreshRates();
  setRefreshing(false);
}, [refreshRates]);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Ładowanie kursów...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kursy walut</Text>

      <TextInput
        style={styles.search}
        placeholder="Szukaj (np. USD)"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.currency}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <RateItem
            {...item}
            onPress={() =>
              navigation.navigate("Exchange", {
                currency: item.currency,
                buy: item.buy,
                sell: item.sell,
              })
            }
          />
        )}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  currency: { fontSize: 18, fontWeight: "bold" },
  name: { color: "#666", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  buy: { color: "green", fontWeight: "600" },
  sell: { color: "red", fontWeight: "600" },
  error: { color: "red", marginBottom: 10 },
  retry: { color: "blue", textDecorationLine: "underline" },
});
