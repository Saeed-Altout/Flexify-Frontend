import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProfilePageClient } from "./_components/profile-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.profile.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function ProfilePage() {
  return <ProfilePageClient />;
}
