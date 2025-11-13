import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "@/lib/auth/server";

import { LoginForm } from "@/components/forms/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
