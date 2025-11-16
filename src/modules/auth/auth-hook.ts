import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
import { Routes } from "@/constants/routes";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { IUserResponse } from "@/modules/auth/auth-type";

export const useCurrentUserQuery = () => {
  const { accessToken, setUser, setIsAuthenticated, setIsInitialized } =
    useAuthStore();

  const query = useQuery<IUserResponse>({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
    enabled: !!accessToken,
    retry: (failureCount, error) => {
      // Don't retry if there's no token
      if (!accessToken) {
        return false;
      }

      // Retry up to 2 times for 401 errors (token might be refreshing)
      const axiosError = error as AxiosError;
      const isUnauthorized =
        axiosError?.response?.status === 401 || axiosError?.status === 401;

      if (isUnauthorized && failureCount < 2) {
        return true;
      }

      // For other errors, retry once
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 500ms, 1000ms
      return Math.min(1000 * 2 ** attemptIndex, 2000);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Handle success/error with useEffect (React Query v5 removed onSuccess/onError)
  useEffect(() => {
    if (query.data?.data.data) {
      setUser(query.data.data.data);
      setIsAuthenticated(true);
      setIsInitialized(true);
    }
  }, [query.data, setUser, setIsAuthenticated, setIsInitialized]);

  useEffect(() => {
    if (query.isError && !query.isLoading) {
      setIsInitialized(true);
    }
  }, [query.isError, query.isLoading, setIsInitialized]);

  return query;
};

export const useSignInMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.login.message");
  const { login: setAuthLogin } = useAuthStore();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (response) => {
      // Update store with user and tokens
      setAuthLogin(response.data.user, response.data.tokens);

      // Update React Query cache
      queryClient.setQueryData(["user", "current"], response.data);
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
  const t = useTranslations("auth.forgetPassword.message");
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
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

export const useResetPasswordMutation = () => {
  const router = useRouter();
  const t = useTranslations("auth.resetPassword.message");

  return useMutation({
    mutationFn: resetPassword,
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

export const useRefreshTokenMutation = () => {
  const { setTokens, clearAuth } = useAuthStore();

  return useMutation({
    mutationKey: ["refreshToken"],
    mutationFn: refreshToken,
    onSuccess: (response) => {
      if (response.data) {
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        });
      }
    },
    onError: () => {
      clearAuth();
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
  const t = useTranslations("auth.changePassword.message");
  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: changePassword,
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

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.logout.message");
  const { logout: clearAuthStore } = useAuthStore();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: (response) => {
      // Clear auth store (includes tokens)
      clearAuthStore();

      // Clear all queries
      queryClient.removeQueries({ queryKey: ["user", "current"] });
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();

      // Redirect to login
      router.push(Routes.login);
      toast.success(response.message || t("success"));
    },
    onError: (error) => {
      // Even if logout fails, clear auth store
      clearAuthStore();
      queryClient.clear();

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("error"));
      }
    },
  });
};
