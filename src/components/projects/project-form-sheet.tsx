"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import { ProjectForm } from "./project-form";
import type { Project } from "@/types";
import type { ProjectFormValues } from "@/utils/projects/project-schema";

interface ProjectFormSheetProps {
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormValues) => void;
  isLoading?: boolean;
}

export function ProjectFormSheet({
  project,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ProjectFormSheetProps) {
  const t = useTranslations("auth.projects.dashboard.formSheet");
  const locale = useLocale();
  const handleSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
    // Don't close immediately - wait for success/error from mutation
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={locale === "ar" ? "left" : "right"}
        className="w-full sm:max-w-4xl p-0 flex flex-col h-full"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-xl font-semibold">
            {project ? t("editTitle") : t("createTitle")}
          </SheetTitle>
          <SheetDescription className="text-sm mt-2">
            {project ? t("editDescription") : t("createDescription")}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 min-h-0">
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
