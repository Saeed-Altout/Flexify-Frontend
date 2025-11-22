import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TestimonialsPageClient } from "./_components/testimonials-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.testimonials.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}

