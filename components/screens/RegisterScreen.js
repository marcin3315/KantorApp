import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Colors } from "../../constants/theme";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert("Błąd", "Uzupełnij wszystkie pola");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Błąd", "Hasło musi mieć min. 6 znaków");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są takie same");
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
      });

      Alert.alert("Sukces", "Konto zostało utworzone");
      navigation.replace("Login");
    } catch (err) {
  let message = "Nie udało się zarejestrować";

  if (err.response?.data?.detail) {
    if (Array.isArray(err.response.data.detail)) {
      message = err.response.data.detail
        .map((e) => e.msg)
        .join("\n");
    } else {
      message = err.response.data.detail;
    }
  }

  Alert.alert("Błąd rejestracji", message);
}

  };

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colorScheme === "dark" ? "#1c1e21" : "#fff",
      borderColor: colors.icon,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Rejestracja</Text>

      <TextInput
        style={inputStyle}
        placeholder="Imię"
        placeholderTextColor={colors.icon}
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={inputStyle}
        placeholder="Nazwisko"
        placeholderTextColor={colors.icon}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={inputStyle}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={inputStyle}
        placeholder="Hasło"
        placeholderTextColor={colors.icon}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={inputStyle}
        placeholder="Powtórz hasło"
        placeholderTextColor={colors.icon}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: colors.tint }]}>
          Masz już konto? Zaloguj się
        </Text>
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
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#1976d2",
  },
});
