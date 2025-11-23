import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoriesPageClient } from "./_components/categories-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.categories.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}

