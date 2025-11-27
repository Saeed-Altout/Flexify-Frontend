import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServicesPageClient } from "./_components/services-page-client";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.services.metadata");

  return generateSeoMetadata({
    title: t("title") || "Services",
    description:
      t("description") ||
      "Professional web development services including full-stack development, API design, and modern web applications.",
    keywords: [
      "Services",
      "Web Development Services",
      "Full Stack Development",
      "Next.js Development",
      "NestJS Development",
      "API Development",
      "Consultation",
    ],
    path: "/services",
    locale,
    type: "website",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <ServicesPageClient />;
}

