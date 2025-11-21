"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";
import { Routes } from "@/constants/routes";
import { useAuthStore } from "@/stores/use-auth-store";
import { AxiosError } from "axios";

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
    refreshToken,
    user: storeUser, 
    isInitialized,
    setIsInitialized,
    clearAuth 
  } = useAuthStore();
  
  const { 
    data: queryUser, 
    isLoading, 
    isError, 
    error, 
    isRefetching 
  } = useCurrentUserQuery();

  // Use user from query (fresh) or store (persisted)
  const user = queryUser?.data?.data || storeUser;

  useEffect(() => {
    // Mark as initialized once loading completes or if we have user from store
    if ((!isLoading && !isInitialized) || (storeUser && !isInitialized)) {
      setIsInitialized(true);
    }

    // If no tokens at all, redirect to login
    if (!accessToken && !refreshToken && !isLoading && isInitialized) {
      router.push(Routes.login);
      return;
    }

    // If query failed with 401 and we have a refresh token,
    // the axios interceptor will handle the refresh automatically.
    // If refresh fails, the interceptor will clear auth and redirect to login.
    // So we just need to wait for the query to complete or fail.
    if (isError && !isLoading && isInitialized) {
      const axiosError = error as AxiosError;
      const isUnauthorized = axiosError?.response?.status === 401;

      if (isUnauthorized) {
        // If we have a refresh token, the interceptor is handling it
        // If refresh fails, interceptor will redirect to login
        // If no refresh token, redirect immediately
        if (!refreshToken) {
          clearAuth();
          router.push(Routes.login);
        }
        // Otherwise, wait for interceptor to handle refresh
        return;
      } else {
        // Non-401 error, might be network or server error
        // Don't redirect, let the error be handled by error boundaries
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
  }, [
    user, 
    isLoading, 
    isError, 
    error, 
    accessToken, 
    refreshToken,
    isInitialized, 
    allowedRoles, 
    redirectTo, 
    router, 
    storeUser,
    clearAuth
  ]);

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
  const currentUser = storeUser || queryUser?.data?.data;
  if (currentUser && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}

