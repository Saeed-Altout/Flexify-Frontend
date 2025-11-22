import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailClient } from "./_components/service-detail-client";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("portfolio.services.detail.metadata");

  return {
    title: t("title", { slug }),
    description: t("description"),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}

