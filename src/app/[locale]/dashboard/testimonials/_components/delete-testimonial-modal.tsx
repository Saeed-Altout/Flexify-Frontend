"use client";

import { useDeleteTestimonialMutation } from "@/modules/testimonials/testimonials-hook";
import { ITestimonial } from "@/modules/testimonials/testimonials-type";
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

interface DeleteTestimonialModalProps {
  testimonial: ITestimonial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTestimonialModal({
  testimonial,
  open,
  onOpenChange,
}: DeleteTestimonialModalProps) {
  const t = useTranslations("dashboard.testimonials.delete");
  const locale = useLocale();
  const deleteMutation = useDeleteTestimonialMutation();

  const translation = testimonial.translations?.find(
    (t) => t.locale === locale
  );
  const fallbackTranslation = testimonial.translations?.[0];
  const authorName =
    translation?.authorName || fallbackTranslation?.authorName || "Testimonial";

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(testimonial.id);
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
            {t("description", { author: authorName })}
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

