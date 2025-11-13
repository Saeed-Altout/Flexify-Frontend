import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ForgetPasswordForm } from "@/components/forms/forget-password-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.forgetPassword.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ForgetPasswordPage() {
  return <ForgetPasswordForm />;
}

