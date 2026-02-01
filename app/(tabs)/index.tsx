import { AuthProvider, useAuth } from "@/components/context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryProvider } from "../../components/context/HistoryContext";
import { RatesProvider } from "../../components/context/RatesContext";
import { WalletProvider } from "../../components/context/WalletContext";
import ExchangeScreen from "../../components/screens/ExchangeScreen";
import HistoryScreen from "../../components/screens/HistoryScreen";
import LoginScreen from "../../components/screens/LoginScreen";
import ProfileScreen from "../../components/screens/ProfileScreen";
import RatesScreen from "../../components/screens/RatesScreen";
import RegisterScreen from "../../components/screens/RegisterScreen";
import TopUpScreen from "../../components/screens/TopUpScreen";
import WalletScreen from "../../components/screens/WalletScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null; // splash / loader

  return isLoggedIn ? <AppStack /> : <AuthStack />;
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <WalletProvider>
      <RatesProvider>
        <HistoryProvider>
          <Stack.Navigator>
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="TopUp" component={TopUpScreen} />
            <Stack.Screen name="Rates" component={RatesScreen} />
            <Stack.Screen name="Exchange" component={ExchangeScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </HistoryProvider>
      </RatesProvider>
    </WalletProvider>
  );
}
