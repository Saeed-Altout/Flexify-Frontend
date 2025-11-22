import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectsPageClient } from "./_components/projects-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.projects.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
