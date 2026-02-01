import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { resetPassword } from "../../api/auth";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function ResetPasswordScreen({ navigation, route }) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const token = route?.params?.resetToken ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
      borderColor: colors.icon,
    },
  ];

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert("Błąd", "Brak tokenu. Przejdź przez formularz przypomnienia hasła.");
      navigation.replace("Login");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Błąd", "Uzupełnij nowe hasło i potwierdzenie");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są takie same");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Błąd", "Hasło musi mieć min. 6 znaków");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      Alert.alert("Sukces", "Hasło zostało zresetowane. Zaloguj się.");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert(
        "Błąd",
        err.response?.data?.detail || "Nie udało się zresetować hasła"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reset hasła</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Wprowadź nowe hasło.
      </Text>

      <TextInput
        style={inputStyle}
        placeholder="Nowe hasło"
        placeholderTextColor={colors.icon}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />

      <TextInput
        style={inputStyle}
        placeholder="Powtórz nowe hasło"
        placeholderTextColor={colors.icon}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Zapisywanie..." : "Zresetuj hasło"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")} disabled={loading}>
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
