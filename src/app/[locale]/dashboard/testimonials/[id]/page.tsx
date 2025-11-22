import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TestimonialDetailClient } from "./_components/testimonial-detail-client";

interface TestimonialDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: TestimonialDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("dashboard.testimonials.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TestimonialDetailPage({
  params,
}: TestimonialDetailPageProps) {
  const { id } = await params;
  return <TestimonialDetailClient id={id} />;
}

