import { API } from "./client";

/* GET /rates */
export const fetchRates = async () => {
  const res = await API.get("/rates/");
  return res.data;
};

/* POST /rates/sync (JWT) */
export const syncRates = async () => {
  const res = await API.post("/rates/sync");
  return res.data;
};
