import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BalanceProvider } from "../../components/context/BalanceContext";
import ExchangeScreen from "../../components/screens/ExchangeScreen";
import RatesScreen from "../../components/screens/RatesScreen";
import TopUpScreen from "../../components/screens/TopUpScreen";
import WalletScreen from "../../components/screens/WalletScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <BalanceProvider>
      <Stack.Navigator>
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="TopUp" component={TopUpScreen} />
        <Stack.Screen name="Rates" component={RatesScreen} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
      </Stack.Navigator>
    </BalanceProvider>
  );
}
