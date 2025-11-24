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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPicker } from "@/components/ui/icon-picker";
import { X } from "lucide-react";
import { toast } from "sonner";
import type {
  IHeroSettings,
  IHeroTranslation,
} from "@/modules/site-settings/site-settings-type";

const heroSettingsSchema = z.object({
  techIcons: z.array(z.string()).min(1, "At least one tech icon is required"),
});

const heroTranslationSchema = z.object({
  badge: z.string().min(1, "Badge is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  cta: z.string().min(1, "CTA is required"),
});

type HeroSettingsFormValues = z.infer<typeof heroSettingsSchema>;
type HeroTranslationFormValues = z.infer<typeof heroTranslationSchema>;

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

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: settingsErrors },
    watch: watchSettings,
    setValue: setSettingsValue,
  } = useForm<HeroSettingsFormValues>({
    resolver: zodResolver(heroSettingsSchema),
    defaultValues: {
      techIcons: heroValue?.techIcons || [],
    },
    values: heroValue
      ? {
          techIcons: heroValue.techIcons,
        }
      : undefined,
  });

  const {
    register: registerEnTranslation,
    handleSubmit: handleSubmitEnTranslation,
    formState: { errors: enTranslationErrors },
  } = useForm<HeroTranslationFormValues>({
    resolver: zodResolver(heroTranslationSchema),
    defaultValues: {
      badge: enTranslation?.badge || "",
      title: enTranslation?.title || "",
      description: enTranslation?.description || "",
      cta: enTranslation?.cta || "",
    },
    values: enTranslation
      ? {
          badge: enTranslation.badge,
          title: enTranslation.title,
          description: enTranslation.description,
          cta: enTranslation.cta,
        }
      : undefined,
  });

  const {
    register: registerArTranslation,
    handleSubmit: handleSubmitArTranslation,
    formState: { errors: arTranslationErrors },
  } = useForm<HeroTranslationFormValues>({
    resolver: zodResolver(heroTranslationSchema),
    defaultValues: {
      badge: arTranslation?.badge || "",
      title: arTranslation?.title || "",
      description: arTranslation?.description || "",
      cta: arTranslation?.cta || "",
    },
    values: arTranslation
      ? {
          badge: arTranslation.badge,
          title: arTranslation.title,
          description: arTranslation.description,
          cta: arTranslation.cta,
        }
      : undefined,
  });

  const techIcons = watchSettings("techIcons");

  const onSettingsSubmit = async (values: HeroSettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync({
        key: "hero",
        data: {
          value: {
            techIcons: values.techIcons,
          },
        },
      });
      toast.success(t("settingsUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onEnTranslationSubmit = async (values: HeroTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "hero",
        data: {
          locale: "en",
          value: values,
        },
      });
      toast.success(t("translationUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onArTranslationSubmit = async (values: HeroTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "hero",
        data: {
          locale: "ar",
          value: values,
        },
      });
      toast.success(t("translationUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  const addTechIcon = (iconName: string) => {
    if (iconName && !techIcons.includes(iconName)) {
      setSettingsValue("techIcons", [...techIcons, iconName]);
    }
  };

  const removeTechIcon = (icon: string) => {
    setSettingsValue(
      "techIcons",
      techIcons.filter((i) => i !== icon)
    );
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
    <Tabs defaultValue="settings" className="space-y-4">
      <TabsList>
        <TabsTrigger value="settings">{t("settingsTab")}</TabsTrigger>
        <TabsTrigger value="translation-en">
          {t("translationTab")} (EN)
        </TabsTrigger>
        <TabsTrigger value="translation-ar">
          {t("translationTab")} (AR)
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>{t("settingsTitle")}</CardTitle>
            <CardDescription>{t("settingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitSettings(onSettingsSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>{t("techIconsLabel")}</Label>
                <div className="flex gap-2">
                  <IconPicker
                    value=""
                    onSelect={addTechIcon}
                  />
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
                {settingsErrors.techIcons && (
                  <p className="text-sm text-destructive">
                    {settingsErrors.techIcons.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={updateSettingsMutation.isPending}>
                {updateSettingsMutation.isPending
                  ? t("saving")
                  : t("saveButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="translation-en">
        <Card>
          <CardHeader>
            <CardTitle>{t("translationTitle")} (EN)</CardTitle>
            <CardDescription>{t("translationDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitEnTranslation(onEnTranslationSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="badge-en">{t("badgeLabel")}</Label>
                <Input
                  id="badge-en"
                  {...registerEnTranslation("badge")}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.badge && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.badge.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title-en">{t("titleLabel")}</Label>
                <Input
                  id="title-en"
                  {...registerEnTranslation("title")}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.title && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description-en">{t("descriptionLabel")}</Label>
                <Textarea
                  id="description-en"
                  {...registerEnTranslation("description")}
                  rows={4}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.description && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-en">{t("ctaLabel")}</Label>
                <Input
                  id="cta-en"
                  {...registerEnTranslation("cta")}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.cta && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.cta.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={updateTranslationMutation.isPending}
              >
                {updateTranslationMutation.isPending
                  ? t("saving")
                  : t("saveButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="translation-ar">
        <Card>
          <CardHeader>
            <CardTitle>{t("translationTitle")} (AR)</CardTitle>
            <CardDescription>{t("translationDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitArTranslation(onArTranslationSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="badge-ar">{t("badgeLabel")}</Label>
                <Input
                  id="badge-ar"
                  {...registerArTranslation("badge")}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.badge && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.badge.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title-ar">{t("titleLabel")}</Label>
                <Input
                  id="title-ar"
                  {...registerArTranslation("title")}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.title && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description-ar">{t("descriptionLabel")}</Label>
                <Textarea
                  id="description-ar"
                  {...registerArTranslation("description")}
                  rows={4}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.description && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-ar">{t("ctaLabel")}</Label>
                <Input
                  id="cta-ar"
                  {...registerArTranslation("cta")}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.cta && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.cta.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={updateTranslationMutation.isPending}
              >
                {updateTranslationMutation.isPending
                  ? t("saving")
                  : t("saveButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
