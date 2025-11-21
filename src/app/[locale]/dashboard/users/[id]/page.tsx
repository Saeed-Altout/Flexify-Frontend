import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UserDetailPageClient } from "./_components/user-detail-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("dashboard.users.detail.metadata");

  return {
    title: t("title", { id }),
    description: t("description"),
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailPageClient userId={id} />;
}

