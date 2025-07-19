"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant.js";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Listen for token changes in localStorage
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    setToken(localStorage.getItem("token"));
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }
        const response = await axios.get(AppRoutes.getCurrentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data?.data); // <-- Make sure this matches your API!
      } catch (error) {
        setUser(null);
      }
    };
    getCurrentUserInfo();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
