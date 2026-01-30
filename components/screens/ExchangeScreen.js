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
import { useBalance } from "../context/BalanceContext";
import { useTransactions } from "../context/TransactionHistoryContext";



export default function ExchangeScreen({ navigation }) {
  const { exchange } = useBalance();
  const { addTransaction } = useTransactions();


  const route = useRoute();
  const { currency, bid, ask } = route.params;

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("BUY"); // BUY | SELL

  const parsedAmount = parseFloat(amount) || 0;

  const rate = mode === "BUY" ? ask : bid;
  const result = parsedAmount * rate;

  const handleSubmit = () => {
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Błąd", "Podaj poprawną kwotę");
      return;
    }

    try {
    exchange({
      mode,
      currency,
      amount: parsedAmount,
      rate,
    });

    addTransaction({  //dodawanie transakcji do historii
      type: mode,
      currency,
      amount: parsedAmount,
      rate,
      total: parsedAmount * rate,
    });

    Alert.alert(
      mode === "BUY"
        ? "Waluta została kupiona"
        : "Waluta została sprzedana"
    );

    navigation.goBack();
  } catch (err) {
    Alert.alert("Błąd", err.message);
  }

    //tutaj w przyszłości:
    // api.post("/fx/trade", {...})
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wymiana waluty</Text>

      <View style={styles.card}>
        <Text style={styles.currency}>{currency}</Text>
        <Text>Kupno: {ask}</Text>
        <Text>Sprzedaż: {bid}</Text>
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
        placeholder={`Ilość ${currency}`}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.summary}>
        <Text>Kurs: {rate}</Text>
        <Text style={styles.total}>
          {mode === "BUY" ? "Do zapłaty" : "Otrzymasz"}: {result.toFixed(2)} PLN
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submit, mode === "BUY" ? styles.buyBtn : styles.sellBtn]}
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
