"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { Project } from "@/types";

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteProjectDialogProps) {
  const t = useTranslations("auth.projects.dashboard.deleteDialog");
  const translation = project?.translations?.[0];
  const projectTitle = translation?.title || "Untitled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { title: projectTitle })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

