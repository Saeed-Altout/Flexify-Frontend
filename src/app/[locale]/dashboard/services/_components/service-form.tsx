"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from "@/modules/services/services-hook";
import { IService } from "@/modules/services/services-type";

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
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional().or(z.literal("")),
  orderIndex: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // English Translation
  nameEn: z.string().min(1, "English name is required"),
  descriptionEn: z.string().optional(),
  shortDescriptionEn: z.string().max(500).optional(),
  contentEn: z.string().optional(),
  metaTitleEn: z.string().max(255).optional(),
  metaDescriptionEn: z.string().max(500).optional(),
  // Arabic Translation
  nameAr: z.string().min(1, "Arabic name is required"),
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

  // Get translations
  const enTranslation = service?.translations?.find(
    (t) => t.locale === "en"
  );
  const arTranslation = service?.translations?.find(
    (t) => t.locale === "ar"
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      slug: service?.slug || "",
      icon: service?.icon || "",
      imageUrl: service?.imageUrl || "",
      color: service?.color || "",
      orderIndex: service?.orderIndex || 0,
      isFeatured: service?.isFeatured || false,
      isActive: service?.isActive !== undefined ? service.isActive : true,
      nameEn: enTranslation?.name || "",
      descriptionEn: enTranslation?.description || "",
      shortDescriptionEn: enTranslation?.shortDescription || "",
      contentEn: enTranslation?.content || "",
      metaTitleEn: enTranslation?.metaTitle || "",
      metaDescriptionEn: enTranslation?.metaDescription || "",
      nameAr: arTranslation?.name || "",
      descriptionAr: arTranslation?.description || "",
      shortDescriptionAr: arTranslation?.shortDescription || "",
      contentAr: arTranslation?.content || "",
      metaTitleAr: arTranslation?.metaTitle || "",
      metaDescriptionAr: arTranslation?.metaDescription || "",
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    const baseData = {
      icon: values.icon || undefined,
      imageUrl: values.imageUrl || undefined,
      color: values.color || undefined,
      orderIndex: values.orderIndex,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
      translations: [
        {
          locale: "en",
          name: values.nameEn,
          description: values.descriptionEn,
          shortDescription: values.shortDescriptionEn,
          content: values.contentEn,
          metaTitle: values.metaTitleEn,
          metaDescription: values.metaDescriptionEn,
        },
        {
          locale: "ar",
          name: values.nameAr,
          description: values.descriptionAr,
          shortDescription: values.shortDescriptionAr,
          content: values.contentAr,
          metaTitle: values.metaTitleAr,
          metaDescription: values.metaDescriptionAr,
        },
      ],
    };

    if (mode === "create") {
      await createMutation.mutateAsync({
        slug: values.slug,
        ...baseData,
      });
      router.push("/dashboard/services");
    } else if (service) {
      await updateMutation.mutateAsync({
        id: service.id,
        data: baseData,
      });
      router.push("/dashboard/services");
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
                  <Input
                    {...field}
                    placeholder={t("iconPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("imageUrlLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder={t("imageUrlPlaceholder")}
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

        <Tabs defaultValue="en" className="w-full">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">Arabic</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-4">
            <FormField
              control={form.control}
              name="nameEn"
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
              name="shortDescriptionEn"
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
              name="descriptionEn"
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
              name="contentEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("contentPlaceholder")}
                      disabled={isLoading}
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitleEn"
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
                name="metaDescriptionEn"
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
          </TabsContent>
          <TabsContent value="ar" className="space-y-4">
            <FormField
              control={form.control}
              name="nameAr"
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
              name="shortDescriptionAr"
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
              name="descriptionAr"
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
              name="contentAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("contentPlaceholder")}
                      disabled={isLoading}
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitleAr"
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
                name="metaDescriptionAr"
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
          </TabsContent>
        </Tabs>

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

