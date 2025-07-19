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
  const { user } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user]);

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
