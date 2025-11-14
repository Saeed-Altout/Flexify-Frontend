/**
 * Core API client utilities
 * Provides standardized fetch wrappers and error handling
 */

import { SESSION_TOKEN_COOKIE_NAME } from "@/constants/auth.constants";
import type { ApiResponse } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

/**
 * Get Accept-Language header from current locale
 */
export async function getAcceptLanguageHeader(): Promise<string> {
  try {
    const { getLocale } = await import("next-intl/server");
    const locale = await getLocale();
    return locale;
  } catch {
    return "en";
  }
}

/**
 * Get session token from cookies (server-side)
 */
export async function getSessionToken(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_TOKEN_COOKIE_NAME)?.value || null;
  } catch {
    return null;
  }
}

/**
 * Base fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const acceptLanguage = await getAcceptLanguageHeader();
  
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": acceptLanguage,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiResponse<null>;
    throw new Error(error.message || "Request failed");
  }

  return (await response.json()) as ApiResponse<T>;
}

/**
 * Authenticated fetch wrapper
 */
export async function authenticatedFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    throw new Error("Authentication required");
  }

  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      ...options.headers,
    },
  });
}

/**
 * Build query string from query parameters
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

