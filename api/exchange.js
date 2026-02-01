import { API } from "./client";

export const exchangeCurrency = async ({
  fromCurrency,
  toCurrency,
  amount,
}) => {
  const res = await API.post("/exchange/", {
    from_currency: fromCurrency,
    to_currency: toCurrency,
    amount,
  });

  return res.data;
};
