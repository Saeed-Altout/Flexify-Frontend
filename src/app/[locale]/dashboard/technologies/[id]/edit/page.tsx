import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TechnologyEditClient } from "./_components/technology-edit-client";

interface TechnologyEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: TechnologyEditPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.technologies.edit.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TechnologyEditPage({
  params,
}: TechnologyEditPageProps) {
  const { id } = await params;
  return <TechnologyEditClient id={id} />;
}

