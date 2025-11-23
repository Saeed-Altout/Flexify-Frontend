import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryDetailClient } from "./_components/category-detail-client";

interface CategoryDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.categories.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { id } = await params;
  return <CategoryDetailClient id={id} />;
}

