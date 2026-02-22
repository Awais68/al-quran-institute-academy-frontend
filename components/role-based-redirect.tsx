"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import LoadingComponent from "./loader";

interface RoleBasedRedirectProps {
  allowedRoles: string[];
  redirectTo?: string;
  children: React.ReactNode;
}

export default function RoleBasedRedirect({
  allowedRoles,
  redirectTo = "/",
  children,
}: RoleBasedRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await apiClient.get('/getCurrentUser/getCurrentUser');
        const user = response.data.data;

        if (!allowedRoles.includes(user.role)) {
          router.push(redirectTo);
        }
      } catch (error) {
        router.push("/");
      }
    };

    checkRole();
  }, [allowedRoles, redirectTo, router]);

  return <>{children}</>;
}

// Hook for getting current user role
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await apiClient.get('/getCurrentUser/getCurrentUser');
        setRole(response.data.data.role);
      } catch (error) {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading };
}

// Higher-order component for role-based protection
export function withRoleProtection(
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) {
  return function ProtectedComponent(props: any) {
    const { role, loading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
      if (!loading && role && !allowedRoles.includes(role)) {
        router.push("/");
      }
    }, [role, loading]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingComponent />
        </div>
      );
    }

    if (!role || !allowedRoles.includes(role)) {
      return null;
    }

    return <Component {...props} />;
  };
}
