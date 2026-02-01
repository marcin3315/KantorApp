import { API } from "./client";

export const fetchHistory = async () => {
  const res = await API.get("/history/");
  return res.data;
};
