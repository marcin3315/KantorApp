import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
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

const NBP_URL = "https://api.nbp.pl/api/exchangerates/tables/C?format=json";

function RateItem({ currency, code, bid, ask, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.currency}>{code}</Text>
      <Text style={styles.name}>{currency}</Text>

      <View style={styles.row}>
        <Text style={styles.buy}>Kup: {bid}</Text>
        <Text style={styles.sell}>Sprzedaj: {ask}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RatesScreen() {
  const navigation = useNavigation();

  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  //Pobieranie z NBP
  const fetchRates = async () => {
    try {
      setError(null); //stary komunikat błędu nie zostanie na ekranie, jeśli kolejne pobranie się uda
      const res = await fetch(NBP_URL);
      const data = await res.json();

      // tabela C → data[0].rates
      setRates(data[0].rates);
    } catch (_e) {
      setError("Nie udało się pobrać kursów z NBP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //Gdy ekran pojawi się pierwszy raz, pobiera kursy walut
    fetchRates();
  }, []);

  //Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRates();
    setRefreshing(false);
  }, []);

  const filteredRates = rates.filter(
    (r) =>
      r.code.toUpperCase().includes(query.toUpperCase()) ||
      r.currency.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Ładowanie kursów NBP...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={fetchRates}>
          <Text style={styles.retry}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kursy walut (NBP)</Text>

      <TextInput
        style={styles.search}
        placeholder="Szukaj (np. EUR, dolar)"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.code}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <RateItem
            {...item}
            onPress={() =>
              navigation.navigate("Exchange", {
                currency: item.code,
                bid: item.bid,
                ask: item.ask,
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
