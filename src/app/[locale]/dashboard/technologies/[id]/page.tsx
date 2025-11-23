import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TechnologyDetailClient } from "./_components/technology-detail-client";

interface TechnologyDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: TechnologyDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.technologies.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TechnologyDetailPage({
  params,
}: TechnologyDetailPageProps) {
  const { id } = await params;
  return <TechnologyDetailClient id={id} />;
}

