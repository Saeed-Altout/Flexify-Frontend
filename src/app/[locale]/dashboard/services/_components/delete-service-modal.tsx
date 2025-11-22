"use client";

import { useDeleteServiceMutation } from "@/modules/services/services-hook";
import { IService } from "@/modules/services/services-type";
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
import { useTranslations, useLocale } from "next-intl";

interface DeleteServiceModalProps {
  service: IService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteServiceModal({
  service,
  open,
  onOpenChange,
}: DeleteServiceModalProps) {
  const t = useTranslations("dashboard.services.delete");
  const locale = useLocale();
  const deleteMutation = useDeleteServiceMutation();

  const translation = service.translations?.find((t) => t.locale === locale);
  const fallbackTranslation = service.translations?.[0];
  const name =
    translation?.name || fallbackTranslation?.name || service.slug;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(service.id);
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

