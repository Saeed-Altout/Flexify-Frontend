"use client";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/shared/file-upload";

export function ImagesField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("images")}</FormLabel>
          <FormControl>
            <FileUpload
              value={field.value || []}
              onChange={(value) => {
                field.onChange(
                  Array.isArray(value) ? value : value ? [value] : []
                );
              }}
              type="image"
              multiple
              maxFiles={10}
              description={t("imagesDescription")}
              error={form.formState.errors.images?.message as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
