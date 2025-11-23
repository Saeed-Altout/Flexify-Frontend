"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
} from "@/modules/technologies/technologies-hook";
import { ITechnology } from "@/modules/technologies/technologies-type";
import { useCategoriesQuery } from "@/modules/categories/categories-hook";
import { useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface TechnologyFormProps {
  technology?: ITechnology;
  mode: "create" | "edit";
}

const technologyFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
});

type TechnologyFormValues = z.infer<typeof technologyFormSchema>;

export function TechnologyForm({ technology, mode }: TechnologyFormProps) {
  const t = useTranslations("dashboard.technologies.form");
  const router = useRouter();

  const createMutation = useCreateTechnologyMutation();
  const updateMutation = useUpdateTechnologyMutation();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery();

  const categories = useMemo(
    () => categoriesData?.data?.data || [],
    [categoriesData]
  );

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues: {
      slug: technology?.slug || "",
      name: technology?.name || "",
      icon: technology?.icon || "",
      description: technology?.description || "",
      category: technology?.category || undefined,
      orderIndex: technology?.orderIndex || 0,
    },
  });

  const onSubmit = async (values: TechnologyFormValues) => {
    const data = {
      slug: values.slug,
      name: values.name,
      icon: values.icon || undefined,
      description: values.description || undefined,
      category: values.category || undefined,
      orderIndex: values.orderIndex || 0,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(data);
      router.push("/dashboard/technologies");
    } else if (technology) {
      await updateMutation.mutateAsync({
        id: technology.id,
        data,
      });
      router.push("/dashboard/technologies");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slugLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("slugPlaceholder")}
                    disabled={mode === "edit" || isLoading}
                  />
                </FormControl>
                <FormDescription>{t("slugDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("namePlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("iconLabel")}</FormLabel>
                <FormControl>
                  <IconPicker
                    value={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("descriptionLabel") || "Description"}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      t("descriptionPlaceholder") || "Enter description"
                    }
                    disabled={isLoading}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryLabel")}</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "" ? undefined : value)
                  }
                  value={field.value ?? ""}
                  disabled={isLoading || categoriesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("categoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">
                      {t("noCategory") || "None"}
                    </SelectItem>
                    {categories.map((category) => {
                      const categoryName = category.name || category.slug;
                      return (
                        <SelectItem key={category.id} value={category.slug}>
                          {categoryName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("orderIndexLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    placeholder={t("orderIndexPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>{t("orderIndexDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/technologies")}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? t("create") : t("update")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
