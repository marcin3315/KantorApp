import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBalance } from "../context/BalanceContext";

export default function WalletScreen({ navigation }) {
  const { balance, wallet} = useBalance();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Portfel</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.historyButtonText}>
            Historia transakcji
          </Text>
        </TouchableOpacity>
      </View>
      
      

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={styles.balanceValue}>
          {balance.toFixed(2)} PLN
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("TopUp")}
        >
          <Text style={styles.actionText}>Zasil konto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Rates")}
        >
          <Text style={styles.actionText}>Wymień walutę</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Posiadane waluty</Text>

      <FlatList
  data={Object.entries(wallet)}
  keyExtractor={([code]) => code}
  renderItem={({ item }) => (
    <View style={styles.currencyRow}>
      <Text>{item[0]}</Text>
      <Text>{item[1]}</Text>
    </View>
  )}
/>
    </View>
  );
}


const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: "#e8f5e9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#555",
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionBtn: {
    backgroundColor: "#1976d2",
    padding: 14,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  currencyCode: {
    fontWeight: "bold",
    fontSize: 16,
  },
  currencyAmount: {
    fontSize: 16,
  },
  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  historyButton: {
    padding: 12,
    backgroundColor: "#1976d2",
    borderRadius: 8,
    marginBottom: 16,
  },
  historyButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

});
