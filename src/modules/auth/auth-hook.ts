import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logout as logoutApi,
  getCurrentUser,
} from "./auth-api";
import {
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyEmailRequest,
  IResendVerificationRequest,
  IRefreshTokenRequest,
} from "./auth-type";
import { Routes } from "@/constants/routes";

// Store tokens in localStorage
const storeTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Get current user query
export const useCurrentUserQuery = () => {
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
    enabled: hasToken, // Only run if token exists
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useSignInMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ILoginRequest) => login(data),
    onSuccess: (response) => {
      storeTokens(response.tokens.accessToken, response.tokens.refreshToken);
      queryClient.setQueryData(["user", "current"], response.user);
      queryClient.setQueryData(["user"], response.user);
      toast.success("Login successful");
      
      // Redirect based on role
      if (response.user.role === "admin" || response.user.role === "super_admin") {
        router.push(`${Routes.dashboard}/profile`);
      } else {
        router.push(Routes.home);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    },
  });
};

// Register mutation
export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: IRegisterRequest) => register(data),
    onSuccess: (response) => {
      // Don't save tokens yet - user must verify email first
      // Redirect to verify account page with verification token and email (for resend)
      toast.success("Registration successful! Please verify your email.");
      router.push(`${Routes.verifyAccount}?token=${encodeURIComponent(response.verificationToken)}&email=${encodeURIComponent(response.user.email)}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    },
  });
};

// Forgot password mutation
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: IForgotPasswordRequest) => forgotPassword(data),
    onSuccess: () => {
      toast.success("If the email exists, a password reset link has been sent");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to send reset email"
        );
      }
    },
  });
};

// Reset password mutation
export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: IResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successful");
      router.push(Routes.login);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Password reset failed");
      }
    },
  });
};

// Verify email mutation
export const useVerifyEmailMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: IVerifyEmailRequest) => verifyEmail(data),
    onSuccess: () => {
      toast.success("Email verified successfully! Please login to continue.");
      router.push(Routes.login);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Email verification failed"
        );
      }
    },
  });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: (data: IRefreshTokenRequest) => refreshToken(data),
    onSuccess: (response) => {
      storeTokens(response.accessToken, response.refreshToken);
    },
    onError: () => {
      // Clear tokens on refresh failure
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  });
};

// Resend verification OTP mutation
export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: (data: IResendVerificationRequest) => resendVerification(data),
    onSuccess: () => {
      toast.success("Verification code sent successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to send verification code"
        );
      }
    },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      logoutApi();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      router.push(Routes.login);
      toast.success("Logged out successfully");
    },
  });
};
