import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { VerifyAccountForm } from "@/components/forms/verify-account-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.verifyAccount.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

interface VerifyAccountPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyAccountPage({
  searchParams,
}: VerifyAccountPageProps) {
  const params = await searchParams;
  const token = params.token;
  const email = params.email;

  if (!token) {
    redirect("/auth/register");
  }

  return <VerifyAccountForm verificationToken={token} email={email} />;
}
