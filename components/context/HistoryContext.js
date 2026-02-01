import { createContext, useContext, useEffect, useState } from "react";
import { fetchHistory } from "../../api/history";
import { useAuth } from "./AuthContext";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadHistory();
    }
  }, [isLoggedIn]);

  return (
    <HistoryContext.Provider value={{ history, loading, refresh: loadHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
