import { createContext, useContext, useState } from "react";

const TransactionHistoryContext = createContext();

export function TransactionHistoryProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        date: new Date(),
        ...transaction,
      },
      ...prev,
    ]);
  };

  return (
    <TransactionHistoryContext.Provider
      value={{ transactions, addTransaction }}
    >
      {children}
    </TransactionHistoryContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionHistoryContext);
}
