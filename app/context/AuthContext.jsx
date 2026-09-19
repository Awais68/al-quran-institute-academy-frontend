"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import apiClient, { isPasswordResetRequired, isRetryableError } from "@/lib/api";
import { clearAuthToken, getAuthToken } from "@/lib/auth-token";
import { getErrorMessage } from "@/lib/error-handler";
import { closeSocket } from "@/lib/socket";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        // Check if token exists
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/getCurrentUser/getCurrentUser');
        setUser(response.data?.data);
        setAuthError("");
      } catch (error) {
        setUser(null);

        // Not a broken session: the account simply owes a password change, and
        // lib/api has already redirected to the form. Showing an auth error
        // here would only confuse the user on a page that works fine.
        if (isPasswordResetRequired(error)) {
          setAuthError("");
          return;
        }

        // Only an explicit rejection from the server means the session is
        // actually dead. A timeout or a network error usually just means the
        // free-tier backend is still waking up — throwing the token away there
        // would log out a user whose session is perfectly valid.
        // A 403 that only asks for a password change is not a dead session:
        // the token still works, and lib/api has already sent the user to the
        // change-password page. Throwing the token away there would strand them.
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        const sessionRejected =
          (status === 401 || status === 403) && !isPasswordResetRequired(error);

        if (sessionRejected) {
          clearAuthToken();
          closeSocket();
        }

        setAuthError(
          getErrorMessage(error, {
            endpoint: "/getCurrentUser/getCurrentUser",
            fallback: isRetryableError(error)
              ? "We couldn't reach the server. It may still be starting up — please try again in a moment."
              : undefined,
          })
        );
        console.warn('Failed to get current user:', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserInfo();
  }, []);

  const logout = () => {
    clearAuthToken();
    setUser(null);
    // Drop the authenticated socket, and tell the service worker to throw away
    // everything it cached — otherwise the next user on a shared device could
    // be served this session's pages.
    closeSocket();
    if (typeof navigator !== "undefined" && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authError, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
