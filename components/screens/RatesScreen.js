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
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

function RateItem({ code, currency, buy, sell, onPress, cardStyle, textStyle }) {
  return (
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onPress}>
      <Text style={[styles.currency, textStyle]}>{code}</Text>
      <Text style={[styles.name, textStyle]}>{currency}</Text>

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
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const inputStyle = [
    styles.search,
    {
      color: colors.text,
      backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
      borderColor: colors.icon,
    },
  ];

  const cardStyle = {
    backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#f9f9f9",
  };

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
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={{ color: colors.text }}>Ładowanie kursów...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Kursy walut</Text>

      <TextInput
        style={inputStyle}
        placeholder="Szukaj (np. USD)"
        placeholderTextColor={colors.icon}
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
            cardStyle={cardStyle}
            textStyle={{ color: colors.text }}
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  currency: { fontSize: 18, fontWeight: "bold" },
  name: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  buy: { color: "green", fontWeight: "600" },
  sell: { color: "red", fontWeight: "600" },
  error: { color: "red", marginBottom: 10 },
  retry: { color: "blue", textDecorationLine: "underline" },
});
