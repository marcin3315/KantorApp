import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../../api/auth";
import { API, setAuthToken } from "../../api/client";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* AUTO LOGIN */
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          const me = await fetchMe();
          setUser(me);
        } catch {
          await AsyncStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  /* LOGIN */
  const login = async (email, password) => {
    const { access_token } = await loginUser(email, password);
    await AsyncStorage.setItem("token", access_token);
    setAuthToken(access_token);
    setUser(await fetchMe());
  };

  /* REGISTER */
const register = async ({ email, password, firstName, lastName }) => {
  await registerUser({
    email,
    password,
    firstName,
    lastName,
  });

  // po rejestracji robimy login
  const { access_token } = await loginUser(email, password);

  await AsyncStorage.setItem("token", access_token);
  setAuthToken(access_token);

  const me = await fetchMe();
  setUser(me);
};


  /* LOGOUT */
  const logout = async () => {
  try {
    await API.post("/auth/logout"); 
  } catch (_e) {

  }

  await AsyncStorage.removeItem("token");
  API.defaults.headers.common.Authorization = "";

  setUser(null);
};

const refreshUser = async () => {
  const me = await fetchMe();
  setUser(me);
};

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
