import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // load user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));

    setUser(res.data.data.user);
  };

  const signup = async (data) => {
    const res = await API.post("/auth/signup", data);

    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));

    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);