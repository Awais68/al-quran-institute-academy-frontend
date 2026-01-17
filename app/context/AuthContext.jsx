"use client";

import { createContext, useState, useEffect } from "react";
import apiClient from "@/lib/api";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/getCurrentUser/getCurrentUser');
        setUser(response.data?.data);
      } catch (error) {
        // If request fails, user is not authenticated
        setUser(null);
        localStorage.removeItem('token');
        console.error('Failed to get current user:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
