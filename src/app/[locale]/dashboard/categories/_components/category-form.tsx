"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/modules/categories/categories-hook";
import { ICategory } from "@/modules/categories/categories-type";

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
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: ICategory;
  mode: "create" | "edit";
}

const categoryFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function CategoryForm({
  category,
  mode,
}: CategoryFormProps) {
  const t = useTranslations("dashboard.categories.form");
  const router = useRouter();

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      slug: category?.slug || "",
      name: category?.name || "",
      description: category?.description || "",
      icon: category?.icon || "",
      orderIndex: category?.orderIndex || 0,
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    const data = {
      slug: values.slug,
      name: values.name,
      description: values.description || undefined,
      icon: values.icon || undefined,
      orderIndex: values.orderIndex || 0,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(data);
      router.push("/dashboard/categories");
    } else if (category) {
      await updateMutation.mutateAsync({
        id: category.id,
        data,
      });
      router.push("/dashboard/categories");
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
            name="orderIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("orderIndexLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder={t("orderIndexPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>{t("orderIndexDescription")}</FormDescription>
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
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("descriptionLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("descriptionPlaceholder")}
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
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/categories")}
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

