"use client";

import type React from "react";

import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { postWithRetry } from "@/lib/api";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { LoadingSpinner } from "../loader";
import {
  getErrorMessage,
  SERVER_STARTING_HINT,
} from "@/lib/error-handler";
import ForgotPasswordModal from "./forgot-password-modal";
import { setAuthToken } from "@/lib/auth-token";
import { refreshSocketAuth } from "@/lib/socket";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterClick: () => void;
  preFilledEmail?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showStartHint, setShowStartHint] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const startTimeRef = useRef<number>(0);
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

  // Reset transient state whenever the modal opens.
  useEffect(() => {
    if (open) {
      setError("");
      setFieldErrors({});
      setIsRetrying(false);
      setShowStartHint(false);
    }
  }, [open]);

  // After a few seconds of waiting, tell the user the server may be booting
  // (free-tier backends sleep and take up to a minute to wake up).
  useEffect(() => {
    if (!isLoading) {
      setShowStartHint(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowStartHint(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isLoading, isRetrying]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowStartHint(false);

    const nextFieldErrors: typeof fieldErrors = {};
    if (!email.trim()) nextFieldErrors.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim()))
      nextFieldErrors.email = "Please enter a valid email address";
    if (!password) nextFieldErrors.password = "Password is required";

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsLoading(true);
    setIsRetrying(false);
    startTimeRef.current = Date.now();

    try {
      const response = await postWithRetry<{
        data?: { token?: string; user?: any };
      }>("/auth/login", { email: email.trim(), password }, {
        retries: 2,
        retryDelay: 2000,
        onRetry: () => {
          setIsRetrying(true);
          setError("");
        },
      });

      const payload = response.data?.data;
      const token = payload?.token;
      const userData = payload?.user;

      // Backend answered but the shape is unexpected - tell the user clearly.
      if (!token || !userData) {
        setError(
          "The server responded in an unexpected format. Please try again or contact support."
        );
        return;
      }

      setAuthToken(token);
      // Re-run the socket handshake so the server sees the new token.
      refreshSocketAuth();
      setUser(userData);

      onOpenChange(false);
      setEmail("");
      setPassword("");
      setError("");
      setFieldErrors({});

      if (userData.role === "Admin") {
        router.replace("/currentUser");
      } else if (userData.role === "Teacher") {
        router.replace("/teacher");
      } else if (userData.role === "Student") {
        router.replace("/students");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      setError(getErrorMessage(err, { endpoint: "/auth/login" }));
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
      setShowStartHint(false);
    }
  };

  const canSubmit = !isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary-800">
            Login to Al-Quran Institute Online
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/95 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {isRetrying && (
          <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50/95 p-3 text-sm text-sky-800">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
            Server is waking up - retrying automatically...
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 pt-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="your.email@example.com"
                className={cn("pl-10", fieldErrors.email && "border-red-400")}
                aria-invalid={Boolean(fieldErrors.email)}
                required
                disabled={!canSubmit}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs font-medium text-red-600">{fieldErrors.email}</p>
            )}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder="••••••••"
                className={cn("pl-10", fieldErrors.password && "border-red-400")}
                aria-invalid={Boolean(fieldErrors.password)}
                required
                disabled={!canSubmit}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs font-medium text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {showStartHint && (
            <p className="rounded-lg border border-amber-200 bg-amber-50/95 p-3 text-xs leading-relaxed text-amber-800">
              {SERVER_STARTING_HINT}
            </p>
          )}

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
                {isRetrying ? "Retrying..." : "Logging in..."}
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