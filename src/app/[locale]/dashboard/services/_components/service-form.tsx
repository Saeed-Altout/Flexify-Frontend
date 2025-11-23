"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useUploadServiceImageMutation,
} from "@/modules/services/services-hook";
import { IService } from "@/modules/services/services-type";
import { ThumbnailUpload } from "../../projects/_components/thumbnail-upload";

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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Loader2 } from "lucide-react";

interface ServiceFormProps {
  service?: IService;
  mode: "create" | "edit";
}

const serviceFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  icon: z.string().optional(),
  imageUrl: z.string().optional(), // Not used in form, kept for compatibility
  orderIndex: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // Translations (optional, added dynamically)
  nameEn: z.string().optional(),
  descriptionEn: z.string().optional(),
  shortDescriptionEn: z.string().max(500).optional(),
  contentEn: z.string().optional(),
  metaTitleEn: z.string().max(255).optional(),
  metaDescriptionEn: z.string().max(500).optional(),
  nameAr: z.string().optional(),
  descriptionAr: z.string().optional(),
  shortDescriptionAr: z.string().max(500).optional(),
  contentAr: z.string().optional(),
  metaTitleAr: z.string().max(255).optional(),
  metaDescriptionAr: z.string().max(500).optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export function ServiceForm({
  service,
  mode,
}: ServiceFormProps) {
  const t = useTranslations("dashboard.services.form");
  const router = useRouter();

  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();
  const uploadImageMutation = useUploadServiceImageMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    service?.imageUrl || null
  );

  // Get translations for initial state
  const existingTranslations = service?.translations || [];
  const initialLocales = existingTranslations.map((t) => t.locale);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      slug: service?.slug || "",
      icon: service?.icon || "",
      imageUrl: service?.imageUrl || "", // Keep for form, but we'll upload separately
      orderIndex: service?.orderIndex || 0,
      isFeatured: service?.isFeatured || false,
      isActive: service?.isActive !== undefined ? service.isActive : true,
      nameEn: existingTranslations.find((t) => t.locale === "en")?.name || "",
      descriptionEn: existingTranslations.find((t) => t.locale === "en")?.description || "",
      shortDescriptionEn: existingTranslations.find((t) => t.locale === "en")?.shortDescription || "",
      contentEn: existingTranslations.find((t) => t.locale === "en")?.content || "",
      metaTitleEn: existingTranslations.find((t) => t.locale === "en")?.metaTitle || "",
      metaDescriptionEn: existingTranslations.find((t) => t.locale === "en")?.metaDescription || "",
      nameAr: existingTranslations.find((t) => t.locale === "ar")?.name || "",
      descriptionAr: existingTranslations.find((t) => t.locale === "ar")?.description || "",
      shortDescriptionAr: existingTranslations.find((t) => t.locale === "ar")?.shortDescription || "",
      contentAr: existingTranslations.find((t) => t.locale === "ar")?.content || "",
      metaTitleAr: existingTranslations.find((t) => t.locale === "ar")?.metaTitle || "",
      metaDescriptionAr: existingTranslations.find((t) => t.locale === "ar")?.metaDescription || "",
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    // Build translations array from form values
    const translations: Array<{
      locale: string;
      name: string;
      description?: string;
      shortDescription?: string;
      content?: string;
      metaTitle?: string;
      metaDescription?: string;
    }> = [];
    
    if (values.nameEn) {
      translations.push({
        locale: "en",
        name: values.nameEn,
        description: values.descriptionEn,
        shortDescription: values.shortDescriptionEn,
        content: values.contentEn,
        metaTitle: values.metaTitleEn,
        metaDescription: values.metaDescriptionEn,
      });
    }
    
    if (values.nameAr) {
      translations.push({
        locale: "ar",
        name: values.nameAr,
        description: values.descriptionAr,
        shortDescription: values.shortDescriptionAr,
        content: values.contentAr,
        metaTitle: values.metaTitleAr,
        metaDescription: values.metaDescriptionAr,
      });
    }

    const baseData = {
      icon: values.icon || undefined,
      // imageUrl is uploaded separately, don't include it here
      orderIndex: values.orderIndex,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
      translations,
    };

    if (mode === "create") {
      // Create service first
      const result = await createMutation.mutateAsync({
        slug: values.slug,
        ...baseData,
      });
      const serviceId = result.data?.data?.id;

      // Upload image if file was selected
      if (imageFile && serviceId) {
        await uploadImageMutation.mutateAsync({
          serviceId,
          file: imageFile,
        });
      }

      router.push("/dashboard/services");
    } else if (service) {
      // Update service first
      await updateMutation.mutateAsync({
        id: service.id,
        data: baseData,
      });

      // Upload image if file was selected
      if (imageFile) {
        await uploadImageMutation.mutateAsync({
          serviceId: service.id,
          file: imageFile,
        });
      }

      router.push("/dashboard/services");
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImageMutation.isPending;

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

          <div>
            <FormLabel className="mb-4 block">
              {t("imageUrlLabel") || "Service Image"}
            </FormLabel>
            <ThumbnailUpload
              currentThumbnail={service?.imageUrl}
              onFileSelect={(file) => {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
              onRemove={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              isUploading={uploadImageMutation.isPending}
              disabled={isLoading}
            />
          </div>

        </div>

        <div className="flex gap-6">
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

          <FormField
            control={form.control}
            name="isFeatured"
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
                  <FormLabel>{t("isFeaturedLabel")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

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
              name={`shortDescription${localeKey}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("shortDescriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("shortDescriptionPlaceholder")}
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
            <FormField
              control={form.control}
              name={`content${localeKey}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel")}</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      placeholder={t("contentPlaceholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name={`metaTitle${localeKey}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("metaTitleLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("metaTitlePlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metaDescription${localeKey}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("metaDescriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("metaDescriptionPlaceholder")}
                        disabled={isLoading}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

