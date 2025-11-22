import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServicesPageClient } from "./_components/services-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.services.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}

