"use client";

import type React from "react";

import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import apiClient from "@/lib/api";
import { AppRoutes } from "@/app/constant/constant";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { LoadingSpinner } from "../loader";
import ForgotPasswordModal from "./forgot-password-modal";
import { setAuthToken } from "@/lib/auth-token";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterClick: () => void;
  preFilledEmail?: string;
}

export default function LoginModal({
  open,
  onOpenChange,
  onRegisterClick,
  preFilledEmail,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);


  useEffect(() => {
    if (open && preFilledEmail) {
      setEmail(preFilledEmail);

      setTimeout(() => {
        const passwordInput = document.getElementById(
          "password"
        ) as HTMLInputElement;
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 100);
    }
  }, [open, preFilledEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Store token in localStorage + cookie (for middleware)
      const token = response.data.data.token;
      if (token) {
        setAuthToken(token);
      }

      // Get user data
      const userData = response.data.data.user;

      // Update AuthContext with user data
      setUser(userData);

      // Close modal and reset form
      onOpenChange(false);
      setEmail("");
      setPassword("");
      setError("");

      // Redirect based on role using replace to prevent back navigation
      if (userData.role === 'Admin') {
        router.replace("/currentUser");
      } else if (userData.role === 'Teacher') {
        router.replace("/teacher");
      } else if (userData.role === 'Student') {
        router.replace("/students");
      } else {
        router.replace("/"); // fallback
      }
    } catch (err: any) {
      // Extract error message from various response formats
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary-800">
            Login to Al-Quran Institute Online
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full bg-primary-600 hover:bg-primary-700",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Register
            </button>
          </div>
        </form>
      </DialogContent>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </Dialog>
  );
}
