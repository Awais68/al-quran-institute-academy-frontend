"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant.js";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        // Use localStorage for web
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        } else {
          const response = await axios.get(AppRoutes.getCurrentUser, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("API response data: ", response?.data);
          setUser(response?.data?.user);
        }
      } catch (error) {
        console.log("no token==>", error.message);
      }
    };
    getCurrentUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
