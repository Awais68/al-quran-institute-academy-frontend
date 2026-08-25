"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import LoginModal from "@/components/auth/login-modal";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user, loading]);

  // Show spinner while auth is being checked to prevent flash of login modal
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onRegisterClick={() => {}}
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="text-red-600 text-center mt-10 font-bold">
        You are not authorized to access this page.
      </div>
    );
  }

  return <>{children}</>;
}
