import * as z from "zod";
import { useTranslations } from "next-intl";

export function useValidationsSchema() {
  const t = useTranslations("validation");
  const tAuth = useTranslations("auth");

  const email = () =>
    z.string().email({
      message: t("email.error"),
    });
  const password = () =>
    z.string().min(8, {
      message: t("password.message", { min: "8" }),
    });
  const otp = () =>
    z.string().length(6, {
      message: tAuth("verifyAccount.otpError"),
    }).regex(/^\d+$/, {
      message: tAuth("verifyAccount.otpError"),
    });

  const loginSchema = () =>
    z.object({
      email: email(),
      password: password(),
    });

  const registerSchema = () =>
    z.object({
      email: email(),
      password: password(),
      confirmPassword: password(),
      firstName: z.string().optional().or(z.literal("")),
      lastName: z.string().optional().or(z.literal("")),
    }).refine((data) => data.password === data.confirmPassword, {
      message: tAuth("register.confirmPasswordError"),
      path: ["confirmPassword"],
    });

  const verifyAccountSchema = () =>
    z.object({
      otp: otp(),
    });

  const forgetPasswordSchema = () =>
    z.object({
      email: email(),
    });

  const resetPasswordSchema = () =>
    z.object({
      password: password(),
      confirmPassword: password(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: tAuth("resetPassword.confirmPasswordError"),
      path: ["confirmPassword"],
    });

  return {
    email,
    password,
    otp,
    loginSchema,
    registerSchema,
    verifyAccountSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
  };
}
