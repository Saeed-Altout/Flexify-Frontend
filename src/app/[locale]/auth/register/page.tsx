import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";

import { RegisterForm } from "@/components/forms/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.register.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
