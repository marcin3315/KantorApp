import { API } from "./client";

/* POST /auth/register */
export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}) => {
  const res = await API.post("/auth/register", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
  return res.data;
};

/* POST /auth/login */
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

/* GET /auth/me */
export const fetchMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const updateProfile = async ({ firstName, lastName }) => {
  const res = await API.patch("/auth/me", {
    first_name: firstName,
    last_name: lastName,
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const res = await API.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return res.data;
};

/* POST /auth/logout */
export const logoutUser = async () => {
  await API.post("/auth/logout");
};
