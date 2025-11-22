import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { InquiryTypeEditClient } from "./_components/inquiry-type-edit-client";

interface InquiryTypeEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: InquiryTypeEditPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.inquiryTypes.edit.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function InquiryTypeEditPage({
  params,
}: InquiryTypeEditPageProps) {
  const { id } = await params;
  return <InquiryTypeEditClient id={id} />;
}

