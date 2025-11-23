"use client";

import { useDeleteTechnologyMutation } from "@/modules/technologies/technologies-hook";
import { ITechnology } from "@/modules/technologies/technologies-type";
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

interface DeleteTechnologyModalProps {
  technology: ITechnology;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTechnologyModal({
  technology,
  open,
  onOpenChange,
}: DeleteTechnologyModalProps) {
  const t = useTranslations("dashboard.technologies.delete");
  const deleteMutation = useDeleteTechnologyMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(technology.id);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", { name: technology.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

