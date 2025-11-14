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

export function MainImageField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="main_image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("mainImage")}</FormLabel>
          <FormControl>
            <FileUpload
              value={field.value}
              onChange={(value) => {
                field.onChange(Array.isArray(value) ? value[0] : value || "");
              }}
              type="image"
              description={t("mainImageDescription")}
              error={form.formState.errors.main_image?.message as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
