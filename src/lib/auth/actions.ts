"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import type { ServerActionResult, LoginResponse, ApiResponse } from "@/types";
import {
  SESSION_TOKEN_COOKIE_NAME,
  SESSION_EXPIRATION_MS,
} from "@/constants/auth.constants";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/**
 * Get the current locale and return it as Accept-Language header value
 */
async function getAcceptLanguageHeader(): Promise<string> {
  try {
    const locale = await getLocale();
    return locale; // Returns 'en' or 'ar'
  } catch {
    // Fallback if locale cannot be determined
    return "en";
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<ServerActionResult<LoginResponse>> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Invalid email or password",
      };
    }

    const result = (await response.json()) as ApiResponse<LoginResponse>;

    // Set cookie manually since we're in server action
    const cookieStore = await cookies();

    // Extract session token from response cookies or use a token from the response
    // The backend sets the cookie, but we need to ensure it's available
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const match = setCookieHeader.match(
        new RegExp(`${SESSION_TOKEN_COOKIE_NAME}=([^;]+)`)
      );
      if (match) {
        cookieStore.set(SESSION_TOKEN_COOKIE_NAME, match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: SESSION_EXPIRATION_MS / 1000, // Convert to seconds
          path: "/",
        });
      }
    } else if (result.data?.session_token) {
      // Fallback: if token is in response body
      cookieStore.set(SESSION_TOKEN_COOKIE_NAME, result.data.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_EXPIRATION_MS / 1000, // Convert to seconds
        path: "/",
      });
    }

    revalidatePath("/", "layout");
    if (!result.data) {
      return {
        success: false,
        error: "Login failed: No data received",
      };
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<ServerActionResult<LoginResponse>> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }

    const result = (await response.json()) as ApiResponse<LoginResponse>;

    // Set cookie manually
    const cookieStore = await cookies();

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const match = setCookieHeader.match(/NEXT_FLEXIFY_SESSION_TOKEN=([^;]+)/);
      if (match) {
        cookieStore.set("NEXT_FLEXIFY_SESSION_TOKEN", match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    } else if (result.data?.session_token) {
      cookieStore.set(SESSION_TOKEN_COOKIE_NAME, result.data.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_EXPIRATION_MS / 1000, // Convert to seconds
        path: "/",
      });
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      data: result.data as LoginResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function signOut(): Promise<never> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_TOKEN_COOKIE_NAME)?.value;
    const acceptLanguage = await getAcceptLanguageHeader();

    if (sessionToken) {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Accept-Language": acceptLanguage,
        },
        credentials: "include",
      });
    }

    cookieStore.delete(SESSION_TOKEN_COOKIE_NAME);
    revalidatePath("/", "layout");
    redirect("/auth/login");
  } catch {
    redirect("/auth/login");
  }
}

export async function forgotPassword(
  email: string
): Promise<ServerActionResult> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to send reset email",
      };
    }

    return { success: true, data: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<ServerActionResult> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to reset password",
      };
    }

    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function verifyAccount(
  email: string,
  code: string
): Promise<ServerActionResult> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/auth/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Invalid verification code",
      };
    }

    revalidatePath("/", "layout");
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function sendVerificationCode(
  email: string
): Promise<ServerActionResult> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(
      `${BACKEND_URL}/api/auth/send-verification-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": acceptLanguage,
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to send verification code",
      };
    }

    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
