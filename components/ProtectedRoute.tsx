"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import LoginModal from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * Client-side gate for dashboard routes.
 *
 * This is a UX guard, not a security boundary: everything it protects is
 * already in the JS bundle, and any real protection has to come from the
 * backend refusing the API calls. Its job is to stop a logged-out or
 * wrong-role user from staring at a dashboard shell full of failed requests.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setShowLoginModal(!loading && !user);
  }, [user, loading]);

  // Spinner while auth resolves, otherwise the login modal flashes for every
  // already-authenticated user on every page load.
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-semibold">Please log in to continue</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page is only available to logged-in members of the academy.
        </p>
        <Button onClick={() => setShowLoginModal(true)}>Log in</Button>
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onRegisterClick={() => {}}
        />
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert className="h-10 w-10 text-amber-500" aria-hidden="true" />
        <h1 className="text-xl font-semibold">This page isn&apos;t for your account</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You&apos;re signed in as {user.role}. Ask an administrator if you think
          you should have access here.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild>
            <Link href="/currentUser">My account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
