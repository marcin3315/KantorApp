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

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Błąd", "Uzupełnij wszystkie pola hasła");
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

    Alert.alert(
      "Zmiana hasła",
      "Backend zmiany hasła nie jest jeszcze podłączony"
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil użytkownika</Text>

      <Text style={styles.section}>Dane podstawowe</Text>

      <TextInput
        style={styles.input}
        value={email}
        editable={false}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Imię"
      />

      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Nazwisko"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Zapisz dane</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Zmiana hasła</Text>

      <TextInput
        style={styles.input}
        placeholder="Stare hasło"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nowe hasło"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Powtórz nowe hasło"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>Zmień hasło</Text>
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
  secondary: {
    backgroundColor: "#388e3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

