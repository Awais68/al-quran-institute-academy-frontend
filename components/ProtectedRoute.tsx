"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      // Not logged in
      router.replace("/");
    } else if (!allowedRoles.includes(user.role)) {
      // Wrong role
      alert("You are not authorized to access this page.");
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [user, allowedRoles, router]);

  // Show nothing or a loader until check is done
  if (!user || !allowedRoles.includes(user.role) || !checked) {
    return null;
  }

  return <>{children}</>;
}
