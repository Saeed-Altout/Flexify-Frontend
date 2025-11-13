import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VerifyAccountForm } from "@/components/forms/verify-account-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.verifyAccount.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function VerifyAccountPage() {
  return <VerifyAccountForm />;
}

