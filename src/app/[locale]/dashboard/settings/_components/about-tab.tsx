"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  useSiteSettingQuery,
  useUpdateSiteSettingMutation,
  useUpdateSiteSettingTranslationMutation,
} from "@/modules/site-settings/site-settings-hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPicker } from "@/components/ui/icon-picker";
import { toast } from "sonner";
import type {
  IAboutSettings,
  IAboutTranslation,
} from "@/modules/site-settings/site-settings-type";

const aboutSettingsSchema = z.object({
  highlights: z
    .array(
      z.object({
        id: z.string(),
        icon: z.string(),
        titleEn: z.string().min(1, "English title is required"),
        titleAr: z.string().min(1, "Arabic title is required"),
        descriptionEn: z.string().min(1, "English description is required"),
        descriptionAr: z.string().min(1, "Arabic description is required"),
      })
    )
    .min(1, "At least one highlight is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  description1En: z.string().min(1, "English first description is required"),
  description1Ar: z.string().min(1, "Arabic first description is required"),
  description2En: z.string().min(1, "English second description is required"),
  description2Ar: z.string().min(1, "Arabic second description is required"),
  ctaEn: z.string().optional(),
  ctaAr: z.string().optional(),
  ctaLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("/") || val.startsWith("http"),
      "URL must start with / or http"
    ),
});

type AboutSettingsFormValues = z.infer<typeof aboutSettingsSchema>;

export function AboutTab() {
  const t = useTranslations("dashboard.settings.about");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("about");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("about");
  const updateSettingsMutation = useUpdateSiteSettingMutation();
  const updateTranslationMutation = useUpdateSiteSettingTranslationMutation();

  const aboutSetting = settingsData?.data?.data;
  const aboutValue = aboutSetting?.value as IAboutSettings | undefined;

  // Get translations for both locales
  const translations = translationData?.data?.data?.translations || [];
  const enTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "en"
  )?.value as IAboutTranslation | undefined;
  const arTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "ar"
  )?.value as IAboutTranslation | undefined;

  // Prepare form values from existing data
  const getFormValues = (): AboutSettingsFormValues => {
    const highlights = (aboutValue?.highlights || []).map((highlight) => {
      const enHighlight = enTranslation?.highlights?.[highlight.id];
      const arHighlight = arTranslation?.highlights?.[highlight.id];
      return {
        ...highlight,
        titleEn: enHighlight?.title || "",
        titleAr: arHighlight?.title || "",
        descriptionEn: enHighlight?.description || "",
        descriptionAr: arHighlight?.description || "",
      };
    });

    return {
      highlights,
      titleEn: enTranslation?.title || "",
      titleAr: arTranslation?.title || "",
      description1En: enTranslation?.description1 || "",
      description1Ar: arTranslation?.description1 || "",
      description2En: enTranslation?.description2 || "",
      description2Ar: arTranslation?.description2 || "",
      ctaEn: enTranslation?.cta || "",
      ctaAr: arTranslation?.cta || "",
      ctaLink: aboutValue?.ctaLink || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AboutSettingsFormValues>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: getFormValues(),
    values:
      aboutValue || enTranslation || arTranslation
        ? getFormValues()
        : undefined,
  });

  const highlights = watch("highlights");

  const addHighlight = () => {
    const newId = `highlight-${Date.now()}`;
    setValue("highlights", [
      ...highlights,
      {
        id: newId,
        icon: "Code",
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
      },
    ]);
  };

  const removeHighlight = (id: string) => {
    setValue(
      "highlights",
      highlights.filter((h) => h.id !== id)
    );
  };

  const onSubmit = async (values: AboutSettingsFormValues) => {
    try {
      // Update settings (highlights with id and icon only, plus ctaLink)
      await updateSettingsMutation.mutateAsync({
        key: "about",
        data: {
          value: {
            highlights: values.highlights.map(
              ({ titleEn, titleAr, descriptionEn, descriptionAr, ...highlight }) =>
                highlight
            ),
            ctaLink: values.ctaLink || undefined,
          },
        },
      });

      // Update EN translation
      const enTranslationValue: IAboutTranslation = {
        title: values.titleEn,
        description1: values.description1En,
        description2: values.description2En,
        cta: values.ctaEn,
        highlights: values.highlights.reduce(
          (acc, highlight) => {
            acc[highlight.id] = {
              title: highlight.titleEn,
              description: highlight.descriptionEn,
            };
            return acc;
          },
          {} as Record<string, { title: string; description: string }>
        ),
      };

      await updateTranslationMutation.mutateAsync({
        key: "about",
        data: {
          locale: "en",
          value: enTranslationValue,
        },
      });

      // Update AR translation
      const arTranslationValue: IAboutTranslation = {
        title: values.titleAr,
        description1: values.description1Ar,
        description2: values.description2Ar,
        cta: values.ctaAr,
        highlights: values.highlights.reduce(
          (acc, highlight) => {
            acc[highlight.id] = {
              title: highlight.titleAr,
              description: highlight.descriptionAr,
            };
            return acc;
          },
          {} as Record<string, { title: string; description: string }>
        ),
      };

      await updateTranslationMutation.mutateAsync({
        key: "about",
        data: {
          locale: "ar",
          value: arTranslationValue,
        },
      });

      toast.success(t("settingsUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (settingsLoading || translationLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("settingsTitle")}</CardTitle>
            <CardDescription>{t("settingsDescription")}</CardDescription>
          </div>
          <Button type="button" onClick={addHighlight} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("addHighlight")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Title, Descriptions, and CTA */}
          <div className="space-y-4 p-4 border rounded-lg">
            <Label className="text-base font-semibold">
              {t("translationTitle")}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("titleLabel")} (EN)</Label>
                <Input {...register("titleEn")} />
                {errors.titleEn && (
                  <p className="text-sm text-destructive">
                    {errors.titleEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("titleLabel")} (AR)</Label>
                <Input {...register("titleAr")} />
                {errors.titleAr && (
                  <p className="text-sm text-destructive">
                    {errors.titleAr.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("description1Label")} (EN)</Label>
                <Textarea {...register("description1En")} rows={3} />
                {errors.description1En && (
                  <p className="text-sm text-destructive">
                    {errors.description1En.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("description1Label")} (AR)</Label>
                <Textarea {...register("description1Ar")} rows={3} />
                {errors.description1Ar && (
                  <p className="text-sm text-destructive">
                    {errors.description1Ar.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("description2Label")} (EN)</Label>
                <Textarea {...register("description2En")} rows={3} />
                {errors.description2En && (
                  <p className="text-sm text-destructive">
                    {errors.description2En.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("description2Label")} (AR)</Label>
                <Textarea {...register("description2Ar")} rows={3} />
                {errors.description2Ar && (
                  <p className="text-sm text-destructive">
                    {errors.description2Ar.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("ctaLabel")} (EN)</Label>
                <Input {...register("ctaEn")} />
                {errors.ctaEn && (
                  <p className="text-sm text-destructive">
                    {errors.ctaEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("ctaLabel")} (AR)</Label>
                <Input {...register("ctaAr")} />
                {errors.ctaAr && (
                  <p className="text-sm text-destructive">
                    {errors.ctaAr.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("ctaUrlLabel") || "CTA URL"}</Label>
              <Input
                {...register("ctaLink")}
                placeholder="/contact"
                type="text"
              />
              {errors.ctaLink && (
                <p className="text-sm text-destructive">
                  {errors.ctaLink.message}
                </p>
              )}
            </div>
          </div>

          {/* Highlights */}
          {highlights.map((highlight, index) => (
            <div key={highlight.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  {t("highlight")} {index + 1}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(highlight.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <input
                type="hidden"
                {...register(`highlights.${index}.id`)}
                value={highlight.id}
              />

              <div className="space-y-2">
                <Label>{t("iconLabel")}</Label>
                <IconPicker
                  value={highlight.icon || ""}
                  onSelect={(iconName) => {
                    setValue(`highlights.${index}.icon`, iconName);
                  }}
                />
                {errors.highlights?.[index]?.icon && (
                  <p className="text-sm text-destructive">
                    {errors.highlights[index]?.icon?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("titleLabel")} (EN)</Label>
                  <Input {...register(`highlights.${index}.titleEn`)} />
                  {errors.highlights?.[index]?.titleEn && (
                    <p className="text-sm text-destructive">
                      {errors.highlights[index]?.titleEn?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("titleLabel")} (AR)</Label>
                  <Input {...register(`highlights.${index}.titleAr`)} />
                  {errors.highlights?.[index]?.titleAr && (
                    <p className="text-sm text-destructive">
                      {errors.highlights[index]?.titleAr?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("description1Label")} (EN)</Label>
                  <Textarea
                    {...register(`highlights.${index}.descriptionEn`)}
                    rows={2}
                  />
                  {errors.highlights?.[index]?.descriptionEn && (
                    <p className="text-sm text-destructive">
                      {errors.highlights[index]?.descriptionEn?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("description1Label")} (AR)</Label>
                  <Textarea
                    {...register(`highlights.${index}.descriptionAr`)}
                    rows={2}
                  />
                  {errors.highlights?.[index]?.descriptionAr && (
                    <p className="text-sm text-destructive">
                      {errors.highlights[index]?.descriptionAr?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {errors.highlights && (
            <p className="text-sm text-destructive">
              {errors.highlights.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              updateSettingsMutation.isPending ||
              updateTranslationMutation.isPending
            }
          >
            {updateSettingsMutation.isPending || updateTranslationMutation.isPending
              ? t("saving")
              : t("saveButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
