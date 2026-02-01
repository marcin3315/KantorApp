import { AuthProvider, useAuth } from "@/components/context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryProvider } from "../../components/context/HistoryContext";
import { RatesProvider } from "../../components/context/RatesContext";
import { WalletProvider } from "../../components/context/WalletContext";
import ExchangeScreen from "../../components/screens/ExchangeScreen";
import ForgotPasswordScreen from "../../components/screens/ForgotPasswordScreen";
import HistoryScreen from "../../components/screens/HistoryScreen";
import LoginScreen from "../../components/screens/LoginScreen";
import ProfileScreen from "../../components/screens/ProfileScreen";
import ResetPasswordScreen from "../../components/screens/ResetPasswordScreen";
import RatesScreen from "../../components/screens/RatesScreen";
import RegisterScreen from "../../components/screens/RegisterScreen";
import TopUpScreen from "../../components/screens/TopUpScreen";
import WalletScreen from "../../components/screens/WalletScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;

  return isLoggedIn ? <AppStack /> : <AuthStack />;
}

function AuthStack() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
    </SafeAreaView>
  );
}

function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="TopUp" component={TopUpScreen} />
    </Stack.Navigator>
  );
}

function RatesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Rates" component={RatesScreen} />
      <Stack.Screen name="Exchange" component={ExchangeScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <WalletProvider>
        <RatesProvider>
          <HistoryProvider>
            <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#1976d2",
            }}
          >
            <Tab.Screen
              name="Portfel"
              component={WalletStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="account-balance-wallet" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Kursy"
              component={RatesStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="currency-exchange" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Historia"
              component={HistoryScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="history" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profil"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </HistoryProvider>
      </RatesProvider>
    </WalletProvider>
    </SafeAreaView>
  );
}
