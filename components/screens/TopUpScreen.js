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

export default function TopUpScreen() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zasilenie konta</Text>

      <TextInput
        style={styles.input}
        placeholder="Kwota (PLN)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.sectionTitle}>Metoda płatności</Text>

      <View style={styles.switch}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            method === "BLIK" && styles.active,
          ]}
          onPress={() => setMethod("BLIK")}
        >
          <Text style={styles.switchText}>BLIK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchButton,
            method === "TRANSFER" && styles.active,
          ]}
          onPress={() => setMethod("TRANSFER")}
        >
          <Text style={styles.switchText}>Przelew</Text>
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
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  active: {
    backgroundColor: "#cce5ff",
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
