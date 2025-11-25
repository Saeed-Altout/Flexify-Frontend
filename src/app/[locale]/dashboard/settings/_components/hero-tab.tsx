"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { X } from "lucide-react";
import { toast } from "sonner";
import type {
  IHeroSettings,
  IHeroTranslation,
} from "@/modules/site-settings/site-settings-type";

const heroSettingsSchema = z.object({
  techIcons: z.array(z.string()).min(1, "At least one tech icon is required"),
  ctaLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("/") || val.startsWith("http"),
      "URL must start with / or http"
    ),
  badgeEn: z.string().min(1, "English badge is required"),
  badgeAr: z.string().min(1, "Arabic badge is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  ctaEn: z.string().optional(),
  ctaAr: z.string().optional(),
});

type HeroSettingsFormValues = z.infer<typeof heroSettingsSchema>;

export function HeroTab() {
  const t = useTranslations("dashboard.settings.hero");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("hero");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("hero");
  const updateSettingsMutation = useUpdateSiteSettingMutation();
  const updateTranslationMutation = useUpdateSiteSettingTranslationMutation();

  const heroSetting = settingsData?.data?.data;
  const heroValue = heroSetting?.value as IHeroSettings | undefined;

  // Get translations for both locales
  const translations = translationData?.data?.data?.translations || [];
  const enTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "en"
  )?.value as IHeroTranslation | undefined;
  const arTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "ar"
  )?.value as IHeroTranslation | undefined;

  // Prepare form values from existing data
  const getFormValues = (): HeroSettingsFormValues => {
    return {
      techIcons: heroValue?.techIcons || [],
      ctaLink: heroValue?.ctaLink || "",
      badgeEn: enTranslation?.badge || "",
      badgeAr: arTranslation?.badge || "",
      titleEn: enTranslation?.title || "",
      titleAr: arTranslation?.title || "",
      descriptionEn: enTranslation?.description || "",
      descriptionAr: arTranslation?.description || "",
      ctaEn: enTranslation?.cta || "",
      ctaAr: arTranslation?.cta || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<HeroSettingsFormValues>({
    resolver: zodResolver(heroSettingsSchema),
    defaultValues: getFormValues(),
    values:
      heroValue || enTranslation || arTranslation
        ? getFormValues()
        : undefined,
  });

  const techIcons = watch("techIcons");

  const addTechIcon = (iconName: string) => {
    if (iconName && !techIcons.includes(iconName)) {
      setValue("techIcons", [...techIcons, iconName]);
    }
  };

  const removeTechIcon = (icon: string) => {
    setValue(
      "techIcons",
      techIcons.filter((i) => i !== icon)
    );
  };

  const onSubmit = async (values: HeroSettingsFormValues) => {
    try {
      // Update settings (techIcons and ctaLink)
      await updateSettingsMutation.mutateAsync({
        key: "hero",
        data: {
          value: {
            techIcons: values.techIcons,
            ctaLink: values.ctaLink || undefined,
          },
        },
      });

      // Update EN translation
      const enTranslationValue: IHeroTranslation = {
        badge: values.badgeEn,
        title: values.titleEn,
        description: values.descriptionEn,
        cta: values.ctaEn || "",
      };

      await updateTranslationMutation.mutateAsync({
        key: "hero",
        data: {
          locale: "en",
          value: enTranslationValue,
        },
      });

      // Update AR translation
      const arTranslationValue: IHeroTranslation = {
        badge: values.badgeAr,
        title: values.titleAr,
        description: values.descriptionAr,
        cta: values.ctaAr || "",
      };

      await updateTranslationMutation.mutateAsync({
        key: "hero",
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
        <div>
          <CardTitle>{t("settingsTitle")}</CardTitle>
          <CardDescription>{t("settingsDescription")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Content - Badge, Title, Description, CTA */}
          <div className="space-y-4 p-4 border rounded-lg">
            <Label className="text-base font-semibold">
              {t("translationTitle")}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("badgeLabel")} (EN)</Label>
                <Input {...register("badgeEn")} />
                {errors.badgeEn && (
                  <p className="text-sm text-destructive">
                    {errors.badgeEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("badgeLabel")} (AR)</Label>
                <Input {...register("badgeAr")} />
                {errors.badgeAr && (
                  <p className="text-sm text-destructive">
                    {errors.badgeAr.message}
                  </p>
                )}
              </div>
            </div>
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
                <Label>{t("descriptionLabel")} (EN)</Label>
                <Textarea {...register("descriptionEn")} rows={4} />
                {errors.descriptionEn && (
                  <p className="text-sm text-destructive">
                    {errors.descriptionEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("descriptionLabel")} (AR)</Label>
                <Textarea {...register("descriptionAr")} rows={4} />
                {errors.descriptionAr && (
                  <p className="text-sm text-destructive">
                    {errors.descriptionAr.message}
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
              <Label>{t("ctaUrlLabel")}</Label>
              <Input
                {...register("ctaLink")}
                placeholder="/projects"
                type="text"
              />
              {errors.ctaLink && (
                <p className="text-sm text-destructive">
                  {errors.ctaLink.message}
                </p>
              )}
            </div>
          </div>

          {/* Tech Icons */}
          <div className="space-y-2">
            <Label>{t("techIconsLabel")}</Label>
            <div className="flex gap-2">
              <IconPicker value="" onSelect={addTechIcon} />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {techIcons.map((icon) => (
                <div
                  key={icon}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted"
                >
                  <span className="text-sm">{icon}</span>
                  <button
                    type="button"
                    onClick={() => removeTechIcon(icon)}
                    className="text-destructive hover:underline text-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.techIcons && (
              <p className="text-sm text-destructive">
                {errors.techIcons.message}
              </p>
            )}
          </div>

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
