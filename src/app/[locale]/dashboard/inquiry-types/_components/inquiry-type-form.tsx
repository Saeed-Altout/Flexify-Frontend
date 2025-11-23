"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  useCreateInquiryTypeMutation,
  useUpdateInquiryTypeMutation,
} from "@/modules/inquiry-types/inquiry-types-hook";
import { IInquiryType } from "@/modules/inquiry-types/inquiry-types-type";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPicker } from "@/components/ui/icon-picker";
import { TranslationInputs } from "@/components/ui/translation-inputs";
import { Loader2 } from "lucide-react";

interface InquiryTypeFormProps {
  inquiryType?: IInquiryType;
  mode: "create" | "edit";
}

const inquiryTypeFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional().or(z.literal("")),
  orderIndex: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  // Translations (optional, added dynamically)
  nameEn: z.string().optional(),
  descriptionEn: z.string().optional(),
  nameAr: z.string().optional(),
  descriptionAr: z.string().optional(),
});

type InquiryTypeFormValues = z.infer<typeof inquiryTypeFormSchema>;

export function InquiryTypeForm({
  inquiryType,
  mode,
}: InquiryTypeFormProps) {
  const t = useTranslations("dashboard.inquiryTypes.form");
  const router = useRouter();

  const createMutation = useCreateInquiryTypeMutation();
  const updateMutation = useUpdateInquiryTypeMutation();

  // Get translations for initial state
  const existingTranslations = inquiryType?.translations || [];
  const initialLocales = existingTranslations.map((t) => t.locale);

  const form = useForm<InquiryTypeFormValues>({
    resolver: zodResolver(inquiryTypeFormSchema),
    defaultValues: {
      slug: inquiryType?.slug || "",
      icon: inquiryType?.icon || "",
      color: inquiryType?.color || "",
      orderIndex: inquiryType?.orderIndex || 0,
      isActive: inquiryType?.isActive !== undefined ? inquiryType.isActive : true,
      nameEn: existingTranslations.find((t) => t.locale === "en")?.name || "",
      descriptionEn: existingTranslations.find((t) => t.locale === "en")?.description || "",
      nameAr: existingTranslations.find((t) => t.locale === "ar")?.name || "",
      descriptionAr: existingTranslations.find((t) => t.locale === "ar")?.description || "",
    },
  });

  const onSubmit = async (values: InquiryTypeFormValues) => {
    // Build translations array from form values
    const translations: Array<{ locale: string; name: string; description?: string }> = [];
    
    if (values.nameEn) {
      translations.push({
        locale: "en",
        name: values.nameEn,
        description: values.descriptionEn,
      });
    }
    
    if (values.nameAr) {
      translations.push({
        locale: "ar",
        name: values.nameAr,
        description: values.descriptionAr,
      });
    }

    const baseData = {
      icon: values.icon || undefined,
      color: values.color || undefined,
      orderIndex: values.orderIndex,
      isActive: values.isActive,
      translations,
    };

    if (mode === "create") {
      await createMutation.mutateAsync({
        slug: values.slug,
        ...baseData,
      });
      router.push("/dashboard/inquiry-types");
    } else if (inquiryType) {
      await updateMutation.mutateAsync({
        id: inquiryType.id,
        data: baseData,
      });
      router.push("/dashboard/inquiry-types");
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("colorLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="color"
                    placeholder={t("colorPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("isActiveLabel")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <TranslationInputs
          initialLocales={initialLocales}
          isLoading={isLoading}
        >
          {(locale, localeKey) => (
            <>
              <FormField
                control={form.control}
                name={`name${localeKey}` as any}
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
                name={`description${localeKey}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("descriptionPlaceholder")}
                        disabled={isLoading}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </TranslationInputs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

