import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactsPageClient } from "./_components/contacts-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.contacts.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function ContactsPage() {
  return <ContactsPageClient />;
}

