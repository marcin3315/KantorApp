import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useWallet } from "../context/WalletContext";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function TopUpScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BLIK"); // BLIK | TRANSFER
  const { topUp } = useWallet();

  const parsedAmount = parseFloat(amount) || 0;

  const handleTopUp = async () => {
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Błąd", "Podaj poprawną kwotę");
      return;
    }

    await topUp(parsedAmount);

    Alert.alert(
      "Zasilenie konta",
      `Kwota: ${parsedAmount.toFixed(2)} PLN\n` +
        `Metoda: ${method === "BLIK" ? "BLIK" : "Przelew wirtualny"}\n\n` +
        `Konto zostało zasilone.`,
      [{ text: "OK" }]
    );

    setAmount("");
  };

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
      borderColor: colors.icon,
    },
  ];

  const switchBtnStyle = (isActive) => [
    styles.switchButton,
    {
      borderColor: colors.icon,
      backgroundColor: isActive
        ? colorScheme === "dark"
          ? "#2d3748"
          : "#cce5ff"
        : colorScheme === "dark"
          ? "#1c1e21"
          : "#fff",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Zasilenie konta</Text>

      <TextInput
        style={inputStyle}
        placeholder="Kwota (PLN)"
        placeholderTextColor={colors.icon}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Metoda płatności
      </Text>

      <View style={styles.switch}>
        <TouchableOpacity
          style={switchBtnStyle(method === "BLIK")}
          onPress={() => setMethod("BLIK")}
        >
          <Text style={[styles.switchText, { color: colors.text }]}>BLIK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={switchBtnStyle(method === "TRANSFER")}
          onPress={() => setMethod("TRANSFER")}
        >
          <Text style={[styles.switchText, { color: colors.text }]}>
            Przelew
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleTopUp}>
        <Text style={styles.submitText}>Zasil konto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  switch: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  switchText: {
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#555",
  },
  submit: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
