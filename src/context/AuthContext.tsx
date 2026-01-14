import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

interface IUser {
  _id: string;
  email: string;
  role: "admin" | "user";
  name: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (token) {
//         try {
//           const res = await api.get("/auth/me");
//           setUser(res.data);
//         } catch (err) {
//           logout();
//         }
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    console.log(res?.data?.data, "res");
    setToken(res.data.data?.accessToken);

    localStorage.setItem("token", res.data.data.accessToken);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const res = await api.post("/users", { name, email, password, role });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
