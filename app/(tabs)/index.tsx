import { TransactionHistoryProvider } from "@/components/context/TransactionHistoryContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BalanceProvider } from "../../components/context/BalanceContext";
import ExchangeScreen from "../../components/screens/ExchangeScreen";
import HistoryScreen from "../../components/screens/HistoryScreen";
import LoginScreen from "../../components/screens/LoginScreen";
import RatesScreen from "../../components/screens/RatesScreen";
import RegisterScreen from "../../components/screens/RegisterScreen";
import TopUpScreen from "../../components/screens/TopUpScreen";
import WalletScreen from "../../components/screens/WalletScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <BalanceProvider>
      <TransactionHistoryProvider>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="TopUp" component={TopUpScreen} />
          <Stack.Screen name="Rates" component={RatesScreen} />
          <Stack.Screen name="Exchange" component={ExchangeScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </TransactionHistoryProvider>
    </BalanceProvider>
  );
}
