import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/login", {
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Login failed");
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post("/register", {
      name,
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Signup failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch {
    throw new Error("Not authenticated");
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } catch (err) {
    console.error("Logout failed");
  }
};