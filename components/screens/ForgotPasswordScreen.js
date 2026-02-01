import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { forgotPassword } from "../../api/auth";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function ForgotPasswordScreen({ navigation }) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
      borderColor: colors.icon,
    },
  ];

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Błąd", "Podaj adres email");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      Alert.alert(
        "Sukces",
        data.message || "Token do resetu hasła został wygenerowany. Ważny 15 minut."
      );
      navigation.navigate("ResetPassword", { resetToken: data.reset_token });
    } catch (err) {
      Alert.alert(
        "Błąd",
        err.response?.data?.detail || "Nie udało się wygenerować tokenu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Przypomnij hasło</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Podaj email powiązany z kontem. Otrzymasz token do resetu hasła.
      </Text>

      <TextInput
        style={inputStyle}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Wysyłanie..." : "Wyślij token"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={[styles.link, { color: colors.tint }]}>Wróć do logowania</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
  },
});
