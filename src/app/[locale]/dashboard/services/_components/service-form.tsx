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
} from "@/modules/services/services-hook";
import { IService } from "@/modules/services/services-type";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPicker } from "@/components/ui/icon-picker";
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
  orderIndex: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // Translations
  nameEn: z.string().min(1, "English name is required"),
  descriptionEn: z.string().optional(),
  nameAr: z.string().min(1, "Arabic name is required"),
  descriptionAr: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export function ServiceForm({ service, mode }: ServiceFormProps) {
  const t = useTranslations("dashboard.services.form");
  const router = useRouter();

  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();

  // Get translations for initial state
  const existingTranslations = service?.translations || [];
  const enTranslation = existingTranslations.find((t) => t.locale === "en");
  const arTranslation = existingTranslations.find((t) => t.locale === "ar");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      slug: service?.slug || "",
      icon: service?.icon || "",
      orderIndex: service?.orderIndex || 0,
      isFeatured: service?.isFeatured || false,
      isActive: service?.isActive !== undefined ? service.isActive : true,
      nameEn: enTranslation?.name || "",
      descriptionEn: enTranslation?.description || "",
      nameAr: arTranslation?.name || "",
      descriptionAr: arTranslation?.description || "",
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    // Build translations array from form values
    const translations = [
      {
        locale: "en",
        name: values.nameEn,
        description: values.descriptionEn,
      },
      {
        locale: "ar",
        name: values.nameAr,
        description: values.descriptionAr,
      },
    ];

    const baseData = {
      icon: values.icon || undefined,
      orderIndex: values.orderIndex,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
      translations,
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

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {/* Basic Info Accordion */}
          <AccordionItem value="basic" className="border rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              {t("basicInfo.title") || "Basic Information"}
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("basicInfo.title") || "Basic Information"}</CardTitle>
                  <CardDescription>
                    {t("basicInfo.description") || "Enter the basic details of your service"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Translations Accordion */}
          <AccordionItem value="translations" className="border rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              {t("translations.title") || "Translations"}
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("translations.title") || "Translations"}</CardTitle>
                  <CardDescription>
                    {t("translations.description") || "Enter service content in both languages"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nameLabel")} (EN)</FormLabel>
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
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nameLabel")} (AR)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("namePlaceholder")}
                              disabled={isLoading}
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("descriptionLabel")} (EN)</FormLabel>
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
                      name="descriptionAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("descriptionLabel")} (AR)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("descriptionPlaceholder")}
                              disabled={isLoading}
                              rows={4}
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Settings Accordion */}
          <AccordionItem value="settings" className="border rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              {t("settings.title") || "Settings"}
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.title") || "Settings"}</CardTitle>
                  <CardDescription>
                    {t("settings.description") || "Configure service settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{t("isActiveLabel")}</FormLabel>
                            <FormDescription>
                              {t("isActiveDescription") || "Service is active and visible"}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{t("isFeaturedLabel")}</FormLabel>
                            <FormDescription>
                              {t("isFeaturedDescription") || "Feature this service prominently"}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
