import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMe, updateProfile } from "../../api/auth";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Wylogowanie",
      "Czy na pewno chcesz się wylogować?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Wyloguj", style: "destructive", onPress: logout },
      ]
    );
  };

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { refreshUser } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await fetchMe();
        setEmail(me.email);
        setFirstName(me.first_name);
        setLastName(me.last_name);
      } catch {
        Alert.alert("Błąd", "Nie udało się pobrać profilu");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
  if (!firstName || !lastName) {
    Alert.alert("Błąd", "Imię i nazwisko nie mogą być puste");
    return;
  }

  try {
    await updateProfile({
      firstName,
      lastName,
    });
    await refreshUser();

    Alert.alert("Sukces", "Dane profilu zostały zapisane");
  } catch (err) {
    Alert.alert(
      "Błąd",
      err.response?.data?.detail || "Nie udało się zapisać profilu"
    );
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

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profil użytkownika</Text>

      <Text style={[styles.section, { color: colors.text }]}>Dane podstawowe</Text>

      <TextInput
        style={inputStyle}
        value={email}
        editable={false}
        placeholder="Email"
        placeholderTextColor={colors.icon}
      />

      <TextInput
        style={inputStyle}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Imię"
        placeholderTextColor={colors.icon}
      />

      <TextInput
        style={inputStyle}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Nazwisko"
        placeholderTextColor={colors.icon}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Zapisz dane</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Wyloguj</Text>
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
  section: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 14,
    borderRadius: 8,
    marginTop: 6,
  },
  logoutButton: {
    backgroundColor: "#e53935",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

