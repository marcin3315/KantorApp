import { createContext, useContext, useEffect, useState } from "react";
import { fetchRates, syncRates } from "../../api/rates";
import { useAuth } from "./AuthContext";

const RatesContext = createContext();

export function RatesProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

const loadRates = async () => {
  const data = await fetchRates();

  const normalized = data.map((r) => ({
    code: r.currency_code,
    currency: r.currency_code,
    buy: Number(r.rate),
    sell: Number(r.rate),
    lastUpdated: r.last_updated,
  }));

  setRates(normalized);
  setLoading(false);
};



  const refreshRates = async () => {
    await syncRates();   // POST /rates/sync
    await loadRates();   // GET /rates
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadRates();
    }
  }, [isLoggedIn]);

  return (
    <RatesContext.Provider
      value={{ rates, loading, refreshRates }}
    >
      {children}
    </RatesContext.Provider>
  );
}

export const useRates = () => useContext(RatesContext);
