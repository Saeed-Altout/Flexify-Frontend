import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectForm } from "../_components/project-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.projects.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function CreateProjectPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <ProjectForm mode="create" />
    </div>
  );
}
