import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceEditClient } from "./_components/service-edit-client";

interface ServiceEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceEditPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.services.edit.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServiceEditPage({
  params,
}: ServiceEditPageProps) {
  const { id } = await params;
  return <ServiceEditClient id={id} />;
}

