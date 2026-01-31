import axios from "axios";

export const API = axios.create({
  baseURL: "https://currencyexchangeapp-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};
