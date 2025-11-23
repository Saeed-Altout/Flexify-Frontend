"use client";

import { useDeleteCategoryMutation } from "@/modules/categories/categories-hook";
import { ICategory } from "@/modules/categories/categories-type";
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

interface DeleteCategoryModalProps {
  category: ICategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryModal({
  category,
  open,
  onOpenChange,
}: DeleteCategoryModalProps) {
  const t = useTranslations("dashboard.categories.delete");
  const deleteMutation = useDeleteCategoryMutation();

  const name = category.name;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(category.id);
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
            {t("description", { name })}
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

