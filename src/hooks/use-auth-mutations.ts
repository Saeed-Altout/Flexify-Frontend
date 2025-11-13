"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  resetPassword,
  verifyAccount,
  sendVerificationCode,
} from "@/lib/auth/actions";
import type {
  SignInVariables,
  SignUpVariables,
  ForgotPasswordVariables,
  ResetPasswordVariables,
  VerifyAccountVariables,
  SendVerificationCodeVariables,
  MutationResult,
  LoginResponse,
} from "@/types";

export function useSignInMutation() {
  const router = useRouter();
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult<LoginResponse>, Error, SignInVariables>({
    mutationFn: async (variables: SignInVariables) => {
      return await signIn(variables.email, variables.password);
    },
    onSuccess: (result) => {
      if (result.error) {
        // Use backend message if available, otherwise use frontend translation
        toast.error(result.error || t("loginError"));
      } else {
        console.log(result);
        toast.success(t("loginSuccess"));
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}

export function useSignUpMutation() {
  const router = useRouter();
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult<LoginResponse>, Error, SignUpVariables>({
    mutationFn: async (variables: SignUpVariables) => {
      return await signUp(
        variables.email,
        variables.password,
        variables.firstName,
        variables.lastName
      );
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("registerError"));
      } else {
        toast.success(t("registerSuccess"));
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}

export function useSignOutMutation() {
  const router = useRouter();
  const t = useTranslations("auth.messages");

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      return await signOut();
    },
    onSuccess: () => {
      toast.success(t("logoutSuccess"));
      router.push("/auth/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("logoutError")
      );
      // Still redirect on error
      router.push("/auth/login");
    },
  });
}

export function useForgotPasswordMutation() {
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult, Error, ForgotPasswordVariables>({
    mutationFn: async (variables: ForgotPasswordVariables) => {
      return await forgotPassword(variables.email);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("forgetPasswordError"));
      } else {
        toast.success(t("forgetPasswordSuccess"));
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult, Error, ResetPasswordVariables>({
    mutationFn: async (variables: ResetPasswordVariables) => {
      return await resetPassword(variables.token, variables.password);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("resetPasswordError"));
      } else {
        toast.success(t("resetPasswordSuccess"));
        router.push("/auth/login");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}

export function useVerifyAccountMutation() {
  const router = useRouter();
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult, Error, VerifyAccountVariables>({
    mutationFn: async (variables: VerifyAccountVariables) => {
      return await verifyAccount(variables.email, variables.code);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("verifyAccountError"));
      } else {
        toast.success(t("verifyAccountSuccess"));
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}

export function useSendVerificationCodeMutation() {
  const t = useTranslations("auth.messages");

  return useMutation<MutationResult, Error, SendVerificationCodeVariables>({
    mutationFn: async (variables: SendVerificationCodeVariables) => {
      return await sendVerificationCode(variables.email);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("sendVerificationCodeError"));
      } else {
        toast.success(t("sendVerificationCodeSuccess"));
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errorOccurred")
      );
    },
  });
}
