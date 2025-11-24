import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SettingsPageClient } from "./_components/settings-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.settings.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SettingsPage() {
  return <SettingsPageClient />;
}

