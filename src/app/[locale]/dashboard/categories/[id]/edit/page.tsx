import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryEditClient } from "./_components/category-edit-client";

interface CategoryEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: CategoryEditPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.categories.edit.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CategoryEditPage({
  params,
}: CategoryEditPageProps) {
  const { id } = await params;
  return <CategoryEditClient id={id} />;
}

