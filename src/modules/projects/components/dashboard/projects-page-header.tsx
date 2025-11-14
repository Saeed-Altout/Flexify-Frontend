"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectsPageHeaderProps {
  onCreateClick: () => void;
}

export function ProjectsPageHeader({ onCreateClick }: ProjectsPageHeaderProps) {
  const t = useTranslations("auth.projects");
  const tDashboard = useTranslations("auth.projects.dashboard");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {t("description")}
        </p>
      </div>
      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        {tDashboard("newProject")}
      </Button>
    </div>
  );
}
