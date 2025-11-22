"use client";

import { use } from "react";
import { useProjectQuery } from "@/modules/projects/projects-hook";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectImagesManager } from "../../_components/project-images-manager";

interface ProjectImagesPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectImagesPage({ params }: ProjectImagesPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations("dashboard.projects.form.images");
  const tLoading = useTranslations("dashboard.projects.images.loading");
  const tError = useTranslations("dashboard.projects.images.error");

  const { data, isLoading, error, refetch } = useProjectQuery(id);

  if (isLoading) {
    return (
      <LoadingState
        title={tLoading("title")}
        description={tLoading("description")}
      />
    );
  }

  if (error || !data?.data?.data) {
    return (
      <ErrorState
        title={tError("title")}
        description={tError("description")}
      />
    );
  }

  const project = data.data.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {project.translations?.find((t) => t.locale === "en")?.title ||
              project.slug}
          </p>
        </div>
      </div>

      {/* Images Manager */}
      <ProjectImagesManager
        projectId={id}
        existingImages={project.images || []}
        onImagesUpdate={() => refetch()}
      />
    </div>
  );
}
