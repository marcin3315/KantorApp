import { createContext, useContext, useEffect, useState } from "react";
import { exchangeCurrency } from "../../api/exchange";
import { fetchWallet, topUpWallet } from "../../api/wallet";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const { isLoggedIn } = useAuth();
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);


  const loadWallet = async () => {
  const balances = await fetchWallet();

  let plnBalance = 0;
  const walletObj = {};

  balances.forEach((b) => {
    const value = Number(b.value);
    walletObj[b.currency] = value;
    if (b.currency === "PLN") {
      plnBalance = value;
    }
  });

  setBalance(plnBalance);
  setWallet(walletObj);
  setLoading(false);
};


  const topUp = async (amount) => {
  const balances = await topUpWallet(amount);

  let plnBalance = 0;
  const walletObj = {};

  balances.forEach((b) => {
    const value = Number(b.value);
    walletObj[b.currency] = value;
    if (b.currency === "PLN") {
      plnBalance = value;
    }
  });

  setBalance(plnBalance);
  setWallet(walletObj);
};


  useEffect(() => {
    if (isLoggedIn) {
      loadWallet();
    }
  }, [isLoggedIn]);


  const exchange = async ({ fromCurrency, toCurrency, amount }) => {
  await exchangeCurrency({ fromCurrency, toCurrency, amount });

  // ponowne pobranie portfela z backendu
  const balances = await fetchWallet();

  let pln = 0;
  const walletObj = {};

  balances.forEach((b) => {
    const value = Number(b.value);
    walletObj[b.currency] = value;
    if (b.currency === "PLN") {
      pln = value;
    }
  });

  setBalance(pln);
  setWallet(walletObj);
};

  return (
    <WalletContext.Provider
      value={{
        balance,
        wallet,
        loading,
        loadWallet,
        topUp,
        exchange
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
