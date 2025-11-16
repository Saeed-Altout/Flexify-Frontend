"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";
import { Routes } from "@/constants/routes";
import type { IUser } from "@/modules/auth/auth-type";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = ["admin", "super_admin"],
  redirectTo = Routes.home,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated
      if (isError || !user) {
        router.push(Routes.login);
        return;
      }

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, isLoading, isError, allowedRoles, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or doesn't have required role
  if (isError || !user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

