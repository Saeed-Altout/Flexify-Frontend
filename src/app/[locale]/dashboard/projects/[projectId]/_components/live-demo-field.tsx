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
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
  InputGroupAddon,
} from "@/components/ui/input-group";

export function LiveDemoField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="live_demo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("liveDemoUrl")}</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupInput
                className="pl-1!"
                {...field}
                type="url"
                placeholder={t("liveDemoUrlPlaceholder")}
              />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
