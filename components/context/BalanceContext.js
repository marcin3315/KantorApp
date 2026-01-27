import { createContext, useContext, useState } from "react";

const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(5000);

  const [wallet, setWallet] = useState({
    USD: 120,
    EUR: 80,
  });

  const topUp = (amount) => {
    setBalance((prev) => prev + amount);
  };


     //Wymiana walut
  const exchange = ({ mode, currency, amount, rate }) => {
    if (mode === "BUY") {
      const cost = amount * rate;

      if (balance < cost) {
        throw new Error("Brak środków");
      }

      setBalance((prev) => prev - cost);

      setWallet((prev) => ({
        ...prev,
        [currency]: (prev[currency] || 0) + amount,
      }));
    }

    if (mode === "SELL") {
      if (!wallet[currency] || wallet[currency] < amount) {
        throw new Error("Brak waluty");
      }

      const income = amount * rate;

      setBalance((prev) => prev + income);

      setWallet((prev) => ({
        ...prev,
        [currency]: prev[currency] - amount,
      }));
    }
  };

  return (
    <BalanceContext.Provider
      value={{ balance, wallet, topUp, exchange }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  return useContext(BalanceContext);
}
