import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TechnologiesPageClient } from "./_components/technologies-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.technologies.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function TechnologiesPage() {
  return <TechnologiesPageClient />;
}

