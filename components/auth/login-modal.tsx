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
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { LoadingSpinner } from "../loader";

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
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Pre-fill email when modal opens with preFilledEmail prop
  useEffect(() => {
    if (open && preFilledEmail) {
      setEmail(preFilledEmail);
      // Focus on password field after a short delay to allow the modal to render
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
      // Replace with your backend login API endpoint
      const response = await axios.post(AppRoutes.login, {
        email,
        password,
      });
      // If login is successful, close modal and reset form
      // if (response.status === 200 || response.status === 201) {
      //   onOpenChange(false);
      //   setEmail("");
      //   setPassword("");
      // } else {
      //   setError("Invalid email or password");
      // }
      console.log("response==>", response);
      localStorage.setItem("token", response.data?.data?.token);
      router.push("/currentUser");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response?.data
            : JSON.stringify(err.response?.data)) ||
          err.message ||
          "Login failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) router.push("/currentStudent");
  });

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
                id="email"
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
              <Link
                href="/forgetPassword"
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Forgot password?
              </Link>
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
    </Dialog>
  );
}
