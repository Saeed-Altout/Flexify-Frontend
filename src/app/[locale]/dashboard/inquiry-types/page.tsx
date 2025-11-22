import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { InquiryTypesPageClient } from "./_components/inquiry-types-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.inquiryTypes.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function InquiryTypesPage() {
  return <InquiryTypesPageClient />;
}

