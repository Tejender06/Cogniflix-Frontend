import api from "./api";

// ================= LOGIN =================
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { error?: string } } };
    throw new Error(e.response?.data?.error || "Login failed");
  }
};

// ================= REGISTER =================
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post("/api/auth/register", { name, email, password });
    return res.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { error?: string } } };
    throw new Error(e.response?.data?.error || "Signup failed");
  }
};

// ================= GET CURRENT USER =================
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/api/auth/me");
    return res.data;
  } catch {
    throw new Error("Not authenticated");
  }
};

// ================= LOGOUT =================
export const logoutUser = async () => {
  try {
    await api.post("/api/auth/logout");
  } catch {
    console.error("Logout failed");
  }
};

// ================= WAKE UP BACKEND =================
export const wakeUpBackend = async () => {
  try {
    await api.get("/api/test");
  } catch {
    // Ignore — just a ping to wake free-tier server
  }
};