import { API } from "./client";

// GET /wallet
export const fetchWallet = async () => {
  const res = await API.get("/wallet/");
  return res.data;
};

// POST /wallet/topup
export const topUpWallet = async (amount) => {
  const res = await API.post("/wallet/topup", {
    amount,
    currency: "PLN",
  });
  return res.data;
};

