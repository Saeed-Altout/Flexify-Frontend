"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ProjectForm } from "./project-form";
import type { Project } from "@/types";
import type { ProjectFormValues } from "../../utils/schema";

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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
    // Don't close immediately - wait for success/error from mutation
  };

  // Determine sheet side based on locale and screen size
  const getSheetSide = (): "top" | "right" | "bottom" | "left" => {
    if (isMobile) return "bottom";
    return locale === "ar" ? "left" : "right";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={getSheetSide()}
        className={cn(
          "w-full p-0 flex flex-col h-full",
          isMobile ? "h-[90vh] max-h-[90vh] rounded-t-2xl" : "sm:max-w-4xl"
        )}
      >
        <SheetHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-lg sm:text-xl font-semibold">
            {project ? t("editTitle") : t("createTitle")}
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm mt-2">
            {project ? t("editDescription") : t("createDescription")}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 min-h-0">
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
