import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TestimonialEditClient } from "./_components/testimonial-edit-client";

interface TestimonialEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: TestimonialEditPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.testimonials.edit.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TestimonialEditPage({
  params,
}: TestimonialEditPageProps) {
  const { id } = await params;
  return <TestimonialEditClient id={id} />;
}

