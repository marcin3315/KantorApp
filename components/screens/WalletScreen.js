import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWallet } from "../context/WalletContext";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function WalletScreen({ navigation }) {
  const { balance, wallet, loading } = useWallet();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const walletEntries = Object.entries(wallet || {}).filter(
    ([_, amount]) => amount > 0
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Portfel</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={styles.balanceValue}>
          {typeof balance === "number" ? balance.toFixed(2) : "0.00"} PLN
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
          onPress={() => navigation.getParent()?.navigate("Kursy")}
        >
          <Text style={styles.actionText}>Wymień walutę</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Posiadane waluty
      </Text>

      {walletEntries.length === 0 ? (
        <Text style={[styles.empty, { color: colors.icon }]}>
          Brak walut w portfelu
        </Text>
      ) : (
        walletEntries.map(([code, amount]) => (
          <View
            key={code}
            style={[
              styles.currencyRow,
              {
                backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
                borderColor: colors.icon,
              },
            ]}
          >
            <Text style={[styles.currencyCode, { color: colors.text }]}>
              {code}
            </Text>
            <Text style={[styles.currencyAmount, { color: colors.text }]}>
              {Number(amount).toFixed(2)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
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
    alignItems: "center",
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
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



});
