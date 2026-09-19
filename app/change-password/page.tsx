"use client";

import type React from "react";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, EyeIcon, EyeOffIcon, LockIcon, ShieldCheck } from "lucide-react";

import { AuthContext } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loader";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { getAuthToken, setAuthToken } from "@/lib/auth-token";
import { dashboardPathForRole } from "@/lib/dashboard-path";
import { getErrorMessage } from "@/lib/error-handler";
import { refreshSocketAuth } from "@/lib/socket";
import { cn } from "@/lib/utils";

/**
 * Set a new password.
 *
 * Two ways in: a user picks "Change password" from their menu, or an account
 * created by an admin is forced here — the backend answers 403
 * PASSWORD_RESET_REQUIRED on every other endpoint until this form succeeds, and
 * lib/api redirects here on that code.
 *
 * Deliberately NOT wrapped in ProtectedRoute: for a forced reset the
 * /getCurrentUser call behind that guard is itself blocked, so `user` is null
 * and the guard would show the login modal to someone who is already logged in.
 * middleware.ts keeps anonymous visitors out.
 */

// Same rule the backend enforces (routers/auth.js), so the user sees the
// problem here instead of a 400.
const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character (@$!%*?&).";

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const { toast } = useToast();

  // The user arrives here with a valid token but, during a forced reset, no
  // loaded profile — so `user` may legitimately be null. Only a missing token
  // means there is nothing to change.
  useEffect(() => {
    if (!getAuthToken()) router.replace("/");
  }, [router]);

  const forced = user?.mustResetPassword === true || !user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors: FieldErrors = {};
    if (!currentPassword) {
      nextFieldErrors.currentPassword = "Enter your current password";
    }
    if (!PASSWORD_RULE.test(newPassword)) {
      nextFieldErrors.newPassword = PASSWORD_HINT;
    } else if (newPassword === currentPassword) {
      nextFieldErrors.newPassword =
        "The new password must be different from the current one";
    }
    if (confirmPassword !== newPassword) {
      nextFieldErrors.confirmPassword = "Both passwords must match";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post<{
        data?: { token?: string; user?: any };
      }>("/auth/change-password", { currentPassword, newPassword });

      const token = response.data?.data?.token;
      const updatedUser = response.data?.data?.user;

      if (!token || !updatedUser) {
        setError(
          "The server responded in an unexpected format. Please try again or contact support."
        );
        return;
      }

      // The old token is still valid, but the response carries a fresh one —
      // keep the session on the newest token and re-handshake the socket.
      setAuthToken(token);
      refreshSocketAuth();
      setUser(updatedUser);

      toast({
        title: "Password updated",
        description: "Use your new password the next time you sign in.",
      });

      router.replace(dashboardPathForRole(updatedUser.role));
    } catch (err) {
      setError(getErrorMessage(err, { endpoint: "/auth/change-password" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm md:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-primary-50 p-3 text-primary-600 dark:bg-primary-950">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-300">
            Choose a new password
          </h1>
          <p className="text-sm text-muted-foreground">
            {forced
              ? "Your account was created with a temporary password. Set your own password to continue."
              : "Enter your current password, then the one you would like to use."}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <PasswordField
            id="current-password"
            label={forced ? "Temporary password" : "Current password"}
            value={currentPassword}
            onChange={(next) => {
              setCurrentPassword(next);
              setFieldErrors((p) => ({ ...p, currentPassword: undefined }));
            }}
            error={fieldErrors.currentPassword}
            show={showPasswords}
            onToggleShow={() => setShowPasswords((v) => !v)}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <div className="space-y-1">
            <PasswordField
              id="new-password"
              label="New password"
              value={newPassword}
              onChange={(next) => {
                setNewPassword(next);
                setFieldErrors((p) => ({ ...p, newPassword: undefined }));
              }}
              error={fieldErrors.newPassword}
              show={showPasswords}
              onToggleShow={() => setShowPasswords((v) => !v)}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {!fieldErrors.newPassword && (
              <p className="text-xs leading-relaxed text-muted-foreground">{PASSWORD_HINT}</p>
            )}
          </div>

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(next) => {
              setConfirmPassword(next);
              setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
            }}
            error={fieldErrors.confirmPassword}
            show={showPasswords}
            onToggleShow={() => setShowPasswords((v) => !v)}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className={cn(
              "w-full bg-primary-600 hover:bg-primary-700",
              isSubmitting && "cursor-not-allowed opacity-70"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Updating...
              </span>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  show: boolean;
  onToggleShow: () => void;
  disabled: boolean;
  autoComplete: string;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  show,
  onToggleShow,
  disabled,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <LockIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={cn("pl-10 pr-10", error && "border-red-400")}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          disabled={disabled}
          required
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
