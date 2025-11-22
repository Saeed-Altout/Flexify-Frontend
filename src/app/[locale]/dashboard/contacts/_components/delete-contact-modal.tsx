"use client";

import { useDeleteContactMutation } from "@/modules/contacts/contacts-hook";
import { IContact } from "@/modules/contacts/contacts-type";
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

interface DeleteContactModalProps {
  contact: IContact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteContactModal({
  contact,
  open,
  onOpenChange,
}: DeleteContactModalProps) {
  const t = useTranslations("dashboard.contacts.delete");
  const deleteMutation = useDeleteContactMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contact.id);
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
            {t("description", { name: contact.name })}
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

