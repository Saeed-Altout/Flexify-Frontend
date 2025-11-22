import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailClient } from "./_components/service-detail-client";

interface ServiceDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.services.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  return <ServiceDetailClient id={id} />;
}

