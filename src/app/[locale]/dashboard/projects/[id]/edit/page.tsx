"use client";

import { use } from "react";
import { useProjectQuery } from "@/modules/projects/projects-hook";
import { useTranslations } from "next-intl";
import { ProjectForm } from "../../_components/project-form";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

// Note: Metadata is handled client-side for dynamic routes
export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const t = useTranslations("dashboard.projects.edit");
  const { data, isLoading, error } = useProjectQuery(id);

  if (isLoading) {
    return (
      <LoadingState
        title={t("loading.title")}
        description={t("loading.description")}
      />
    );
  }

  if (error || !data?.data?.data) {
    return (
      <ErrorState
        title={t("error.title")}
        description={t("error.description")}
      />
    );
  }

  const project = data.data.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}

