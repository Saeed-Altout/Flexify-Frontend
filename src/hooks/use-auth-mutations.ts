"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

  return useMutation<MutationResult<LoginResponse>, Error, SignInVariables>({
    mutationFn: async (variables: SignInVariables) => {
      return await signIn(variables.email, variables.password);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        console.log(result);
        toast.success("Login successful");
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    },
  });
}

export function useSignUpMutation() {
  const router = useRouter();

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
        toast.error(result.error);
      } else {
        toast.success("Registration successful");
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
    },
  });
}

export function useSignOutMutation() {
  const router = useRouter();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      return await signOut();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during logout"
      );
      // Still redirect on error
      router.push("/auth/login");
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation<MutationResult, Error, ForgotPasswordVariables>({
    mutationFn: async (variables: ForgotPasswordVariables) => {
      return await forgotPassword(variables.email);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password reset email sent. Please check your inbox.");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while sending reset email"
      );
    },
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();

  return useMutation<MutationResult, Error, ResetPasswordVariables>({
    mutationFn: async (variables: ResetPasswordVariables) => {
      return await resetPassword(variables.token, variables.password);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password reset successful. You can now login.");
        router.push("/auth/login");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while resetting password"
      );
    },
  });
}

export function useVerifyAccountMutation() {
  const router = useRouter();

  return useMutation<MutationResult, Error, VerifyAccountVariables>({
    mutationFn: async (variables: VerifyAccountVariables) => {
      return await verifyAccount(variables.email, variables.code);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account verified successfully");
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during verification"
      );
    },
  });
}

export function useSendVerificationCodeMutation() {
  return useMutation<MutationResult, Error, SendVerificationCodeVariables>({
    mutationFn: async (variables: SendVerificationCodeVariables) => {
      return await sendVerificationCode(variables.email);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Verification code sent. Please check your email.");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while sending verification code"
      );
    },
  });
}
