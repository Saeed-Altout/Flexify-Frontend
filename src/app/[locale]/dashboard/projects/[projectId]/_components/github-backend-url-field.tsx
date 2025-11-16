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

export function GithubBackendUrlField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="github_backend_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("githubBackendUrl")}</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupInput
                className="pl-1!"
                {...field}
                type="url"
                placeholder={t("githubBackendUrlPlaceholder")}
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
