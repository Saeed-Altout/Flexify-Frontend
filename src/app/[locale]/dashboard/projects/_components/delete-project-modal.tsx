"use client";

import { useRouter } from "@/i18n/navigation";
import { IProject } from "@/modules/projects/projects-type";
import { useDeleteProjectMutation } from "@/modules/projects/projects-hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface DeleteProjectModalProps {
  project: IProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectModal({
  project,
  open,
  onOpenChange,
}: DeleteProjectModalProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.projects.deleteModal");
  const deleteProjectMutation = useDeleteProjectMutation();

  const handleDelete = async () => {
    await deleteProjectMutation.mutateAsync(project.id);
    onOpenChange(false);
  };

  const projectTitle = project.translations?.[0]?.title || project.slug;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", { title: projectTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProjectMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProjectMutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

