import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactDetailClient } from "./_components/contact-detail-client";

interface ContactDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("dashboard.contacts.detail.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  return <ContactDetailClient id={id} />;
}

