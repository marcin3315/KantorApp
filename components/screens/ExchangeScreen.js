import { useRoute } from "@react-navigation/native";
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



export default function ExchangeScreen({ navigation }) {
  const { exchange } = useWallet();


  const route = useRoute();
  const { currency} = route.params;

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("BUY"); // BUY | SELL

  const parsedAmount = parseFloat(amount) || 0;

  const handleSubmit = async () => {
  if (!parsedAmount || parsedAmount <= 0) {
    Alert.alert("Błąd", "Podaj poprawną kwotę");
    return;
  }

  try {
    await exchange({
      fromCurrency: mode === "BUY" ? "PLN" : currency,
      toCurrency: mode === "BUY" ? currency : "PLN",
      amount: parsedAmount,
    });

    Alert.alert("Sukces", "Wymiana zakończona");

    navigation.goBack();
  } catch (err) {
    Alert.alert(
      "Błąd",
      err.response?.data?.detail || "Błąd wymiany waluty"
    );
  }
};


  return (
  <View style={styles.container}>
    <Text style={styles.title}>Wymiana waluty</Text>

    <View style={styles.card}>
      <Text style={styles.currency}>{currency}</Text>
    </View>

    <View style={styles.switch}>
      <TouchableOpacity
        style={[styles.switchButton, mode === "BUY" && styles.activeBuy]}
        onPress={() => setMode("BUY")}
      >
        <Text style={styles.switchText}>Kup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.switchButton, mode === "SELL" && styles.activeSell]}
        onPress={() => setMode("SELL")}
      >
        <Text style={styles.switchText}>Sprzedaj</Text>
      </TouchableOpacity>
    </View>

    <TextInput
      style={styles.input}
      placeholder={`Ilość ${mode === "BUY" ? "PLN" : currency}`}
      keyboardType="numeric"
      value={amount}
      onChangeText={setAmount}
    />

    <TouchableOpacity
      style={[
        styles.submit,
        mode === "BUY" ? styles.buyBtn : styles.sellBtn,
      ]}
      onPress={handleSubmit}
    >
      <Text style={styles.submitText}>
        {mode === "BUY" ? "Kup walutę" : "Sprzedaj walutę"}
      </Text>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  currency: {
    fontSize: 20,
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
  activeBuy: {
    backgroundColor: "#c8f7c5",
  },
  activeSell: {
    backgroundColor: "#f7c5c5",
  },
  switchText: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summary: {
    marginBottom: 20,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  submit: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buyBtn: {
    backgroundColor: "green",
  },
  sellBtn: {
    backgroundColor: "red",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
