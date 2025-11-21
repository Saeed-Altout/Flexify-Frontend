"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";
import { Routes } from "@/constants/routes";
import { useAuthStore } from "@/stores/use-auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo }: AuthGuardProps) {
  const router = useRouter();
  const { accessToken, user: storeUser } = useAuthStore();
  const { data: queryUser, isLoading } = useCurrentUserQuery();

  // Use user from query (fresh) or store (persisted)
  const user = queryUser?.data?.data || storeUser;

  useEffect(() => {
    if (!isLoading && user) {
      // User is authenticated, redirect based on role
      const redirectPath =
        redirectTo ||
        (user.role === "admin" || user.role === "super_admin"
          ? Routes.dashboardProfile
          : Routes.home);
      router.push(redirectPath);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading || (accessToken && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is not authenticated
  if (!user && !accessToken) {
    return <>{children}</>;
  }

  // User is authenticated, don't render (will redirect)
  return null;
}
