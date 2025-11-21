import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UsersPageClient } from "./_components/users-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.users.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function UsersPage() {
  return <UsersPageClient />;
}
