"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";
import { Routes } from "@/constants/routes";
import { useAuthStore } from "@/stores/use-auth-store";

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
  const { 
    accessToken, 
    user: storeUser, 
    isInitialized,
    setIsInitialized 
  } = useAuthStore();
  
  const { 
    data: queryUser, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isRefetching 
  } = useCurrentUserQuery();

  // Use user from store (persisted) or query (fresh)
  const user = storeUser || queryUser?.data;

  useEffect(() => {
    // Mark as initialized once loading completes or if we have user from store
    if ((!isLoading && !isInitialized) || (storeUser && !isInitialized)) {
      setIsInitialized(true);
    }

    // If no token at all, redirect immediately
    if (!accessToken && !isLoading && isInitialized) {
      router.push(Routes.login);
      return;
    }

    // If there's a token but query failed, it might be expired
    // The axios interceptor should handle refresh, so wait a bit and retry
    if (isError && accessToken && !isLoading) {
      const isUnauthorized = 
        (error as any)?.response?.status === 401 ||
        (error as any)?.status === 401;

      if (isUnauthorized) {
        // Wait for token refresh to complete, then retry
        const retryTimer = setTimeout(() => {
          refetch().catch(() => {
            // If retry fails and token was cleared, redirect
            const currentToken = useAuthStore.getState().accessToken;
            if (!currentToken) {
              router.push(Routes.login);
            }
          });
        }, 1000);

        return () => clearTimeout(retryTimer);
      } else {
        // Non-401 error, redirect
        router.push(Routes.login);
        return;
      }
    }

    // Check role permissions when user is available
    if (user && !isLoading && isInitialized) {
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, isLoading, isError, error, accessToken, isInitialized, allowedRoles, redirectTo, router, refetch]);

  // Show loading state while checking auth
  // Only show loading if:
  // 1. Query is actively loading/refetching AND we don't have user from store
  // Don't show loading if we have user from store (after login) - we can render immediately
  const shouldShowLoading = 
    (isLoading || isRefetching) && 
    !storeUser; // Only show loading if we don't have user from store

  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  // If we have user from store, we're authenticated even if query hasn't run
  if (!accessToken || (!user && !storeUser)) {
    return null;
  }

  // Don't render if user doesn't have required role
  const currentUser = storeUser || queryUser?.data;
  if (currentUser && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}

