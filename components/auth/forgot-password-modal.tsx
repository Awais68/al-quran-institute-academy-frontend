"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // Separate from `error` (server failures) so a bad email paints the field
  // red rather than only printing a banner above it.
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setEmailError("");

    try {
      await apiClient.post("/auth/forgot-password", { email });

      setSuccess(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for password reset instructions",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        onOpenChange(false);
      }, 3000);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        endpoint: "/auth/forgot-password",
        fallback: "Failed to send reset email. Please try again.",
      });
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setError("");
      setEmailError("");
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-modal sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900">Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="ml-2 text-green-800">
                <strong>Email sent successfully!</strong>
                <br />
                Please check your inbox and follow the instructions to reset your password.
                If you don't see the email, check your spam folder.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setEmailError("");
                  }}
                  disabled={loading}
                  autoFocus
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "forgot-email-error" : undefined}
                  className={cn(
                    "w-full",
                    emailError && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {emailError && (
                  <p id="forgot-email-error" className="text-xs font-medium text-red-600">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The reset link will be valid for 1 hour. 
                  If you don't receive the email within a few minutes, please check your spam folder.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
