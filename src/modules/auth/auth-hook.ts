import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getCurrentUser,
  changePassword,
  logout,
} from "@/modules/auth/auth-api";
import { useTranslations } from "next-intl";

import {
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyEmailRequest,
  IResendVerificationRequest,
  IRefreshTokenRequest,
  IChangePasswordRequest,
  IRegisterResponse,
} from "@/modules/auth/auth-type";

import { Routes } from "@/constants/routes";
import { useRouter } from "@/i18n/navigation";

const storeTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const useCurrentUserQuery = () => {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSignInMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.login.message");

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (response) => {
      storeTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      queryClient.setQueryData(["user", "current"], response.data.user);
      queryClient.setQueryData(["user"], response.data.user);
      toast.success(response.message || t("success"));
      router.push(Routes.home);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("error"));
      }
    },
  });
};

export const useSignUpMutation = () => {
  const router = useRouter();
  const t = useTranslations("auth.register.message");

  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (response) => {
      toast.success(response.message || t("success"));
      router.push(
        `${Routes.verifyAccount}?token=${encodeURIComponent(
          response.data.verificationToken
        )}&email=${encodeURIComponent(response.data.user.email)}`
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("error"));
      }
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ["user", "forgot-password"],
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

export const useVerifyEmailMutation = () => {
  const router = useRouter();
  const t = useTranslations("auth.verifyAccount.message");

  return useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      toast.success(response.message || t("success"));
      router.push(Routes.login);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("error"));
      }
    },
  });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: (data: IRefreshTokenRequest) => refreshToken(data),
    onSuccess: (response) => {
      if (!response.data) {
        toast.error(response.message || "");
        return;
      }
      const { accessToken, refreshToken } = response.data;
      storeTokens(accessToken, refreshToken);
    },
    onError: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  });
};

export const useResendVerificationMutation = () => {
  const t = useTranslations("auth.resendVerification.message");
  return useMutation({
    mutationKey: ["resendVerification"],
    mutationFn: resendVerification,
    onSuccess: (response) => {
      toast.success(response.message || t("success"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("error"));
      }
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: IChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to change password"
        );
      }
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user", "logout"],
    mutationFn: () => logout(),
    onSuccess: (response) => {
      // Clear tokens from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      // Clear all queries
      queryClient.removeQueries({ queryKey: ["user", "current"] });
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      // Redirect to login
      router.push(Routes.login);
      toast.success(response.message || "Logged out successfully");
    },
    onError: (error) => {
      // Even if logout fails, clear local tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      queryClient.clear();
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to logout");
      }
    },
  });
};
