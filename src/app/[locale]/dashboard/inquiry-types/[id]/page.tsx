import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { useInquiryTypeQuery } from "@/modules/inquiry-types/inquiry-types-hook";
import { InquiryTypeDetailClient } from "./_components/inquiry-type-detail-client";

interface InquiryTypeDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: InquiryTypeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  // Note: In a real app, you'd fetch the inquiry type here for metadata
  const t = await getTranslations("dashboard.inquiryTypes.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function InquiryTypeDetailPage({
  params,
}: InquiryTypeDetailPageProps) {
  const { id } = await params;
  return <InquiryTypeDetailClient id={id} />;
}

