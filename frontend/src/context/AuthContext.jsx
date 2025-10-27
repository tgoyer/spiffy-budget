import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await apiFetch("/sessions/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  async function signup({ email, password, name, family_id }) {
    const data = await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({ email, password, name, family_id }),
    });
    return data;
  }

  async function login({ email, password }) {
    const data = await apiFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  }

  async function logout() {
    await apiFetch("/sessions", { method: "DELETE" });
    setUser(null);
  }

  const value = { user, loading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
