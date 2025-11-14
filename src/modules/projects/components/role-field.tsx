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
import { Input } from "@/components/ui/input";

export function RoleField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("role")}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={t("rolePlaceholder")} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
