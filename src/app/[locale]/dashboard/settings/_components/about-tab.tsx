"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type {
  IAboutSettings,
  IAboutTranslation,
  IAboutHighlight,
} from "@/modules/site-settings/site-settings-type";

const aboutSettingsSchema = z.object({
  highlights: z
    .array(
      z.object({
        id: z.string(),
        icon: z.string(),
      })
    )
    .min(1, "At least one highlight is required"),
});

const aboutTranslationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description1: z.string().min(1, "First description is required"),
  description2: z.string().min(1, "Second description is required"),
  cta: z.string().min(1, "CTA is required"),
  highlights: z.record(
    z.string(),
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    })
  ),
});

type AboutSettingsFormValues = z.infer<typeof aboutSettingsSchema>;
type AboutTranslationFormValues = z.infer<typeof aboutTranslationSchema>;

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

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: settingsErrors },
    watch: watchSettings,
    setValue: setSettingsValue,
  } = useForm<AboutSettingsFormValues>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: {
      highlights: aboutValue?.highlights || [],
    },
    values: aboutValue
      ? {
          highlights: aboutValue.highlights,
        }
      : undefined,
  });

  const {
    register: registerEnTranslation,
    handleSubmit: handleSubmitEnTranslation,
    formState: { errors: enTranslationErrors },
    watch: watchEnTranslation,
    setValue: setEnTranslationValue,
  } = useForm<AboutTranslationFormValues>({
    resolver: zodResolver(aboutTranslationSchema),
    defaultValues: {
      title: enTranslation?.title || "",
      description1: enTranslation?.description1 || "",
      description2: enTranslation?.description2 || "",
      cta: enTranslation?.cta || "",
      highlights: enTranslation?.highlights || {},
    },
    values: enTranslation
      ? {
          title: enTranslation.title,
          description1: enTranslation.description1,
          description2: enTranslation.description2,
          cta: enTranslation.cta,
          highlights: enTranslation.highlights,
        }
      : undefined,
  });

  const {
    register: registerArTranslation,
    handleSubmit: handleSubmitArTranslation,
    formState: { errors: arTranslationErrors },
    watch: watchArTranslation,
    setValue: setArTranslationValue,
  } = useForm<AboutTranslationFormValues>({
    resolver: zodResolver(aboutTranslationSchema),
    defaultValues: {
      title: arTranslation?.title || "",
      description1: arTranslation?.description1 || "",
      description2: arTranslation?.description2 || "",
      cta: arTranslation?.cta || "",
      highlights: arTranslation?.highlights || {},
    },
    values: arTranslation
      ? {
          title: arTranslation.title,
          description1: arTranslation.description1,
          description2: arTranslation.description2,
          cta: arTranslation.cta,
          highlights: arTranslation.highlights,
        }
      : undefined,
  });

  const highlights = watchSettings("highlights");
  const enTranslationHighlights = watchEnTranslation("highlights");
  const arTranslationHighlights = watchArTranslation("highlights");
  const [newHighlightId, setNewHighlightId] = useState("");
  const [newHighlightIcon, setNewHighlightIcon] = useState("");

  const addHighlight = () => {
    if (newHighlightId.trim() && newHighlightIcon.trim()) {
      const id = newHighlightId.trim();
      setSettingsValue("highlights", [
        ...highlights,
        { id, icon: newHighlightIcon.trim() },
      ]);
      setEnTranslationValue(`highlights.${id}.title` as any, "");
      setEnTranslationValue(`highlights.${id}.description` as any, "");
      setArTranslationValue(`highlights.${id}.title` as any, "");
      setArTranslationValue(`highlights.${id}.description` as any, "");
      setNewHighlightId("");
      setNewHighlightIcon("");
    }
  };

  const removeHighlight = (id: string) => {
    setSettingsValue(
      "highlights",
      highlights.filter((h) => h.id !== id)
    );
    const newEnHighlights = { ...enTranslationHighlights };
    const newArHighlights = { ...arTranslationHighlights };
    delete newEnHighlights[id];
    delete newArHighlights[id];
    setEnTranslationValue("highlights", newEnHighlights);
    setArTranslationValue("highlights", newArHighlights);
  };

  const onSettingsSubmit = async (values: AboutSettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync({
        key: "about",
        data: {
          value: {
            highlights: values.highlights,
          },
        },
      });
      toast.success(t("settingsUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onEnTranslationSubmit = async (values: AboutTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "about",
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

  const onArTranslationSubmit = async (values: AboutTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "about",
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
                <Label>{t("addHighlight")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={newHighlightId}
                    onChange={(e) => setNewHighlightId(e.target.value)}
                    placeholder={t("highlightIdPlaceholder")}
                  />
                  <Input
                    value={newHighlightIcon}
                    onChange={(e) => setNewHighlightIcon(e.target.value)}
                    placeholder={t("highlightIconPlaceholder")}
                  />
                  <Button type="button" onClick={addHighlight}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("add")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        {t("highlight")} {index + 1}: {highlight.id}
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
                      {...registerSettings(`highlights.${index}.id`)}
                      value={highlight.id}
                    />

                    <div className="space-y-2">
                      <Label>{t("iconLabel")}</Label>
                      <Input
                        {...registerSettings(`highlights.${index}.icon`)}
                        placeholder="code"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {settingsErrors.highlights && (
                <p className="text-sm text-destructive">
                  {settingsErrors.highlights.message}
                </p>
              )}

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
                <Label htmlFor="description1-en">
                  {t("description1Label")}
                </Label>
                <Textarea
                  id="description1-en"
                  {...registerEnTranslation("description1")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.description1 && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.description1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description2-en">
                  {t("description2Label")}
                </Label>
                <Textarea
                  id="description2-en"
                  {...registerEnTranslation("description2")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.description2 && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.description2.message}
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

              <div className="space-y-4">
                <Label>{t("highlightsLabels")}</Label>
                {highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <Label className="text-base font-semibold">
                      {t("highlight")}: {highlight.id}
                    </Label>
                    <div className="space-y-2">
                      <Label htmlFor={`highlight-en-${highlight.id}-title`}>
                        {t("titleLabel")}
                      </Label>
                      <Input
                        id={`highlight-en-${highlight.id}-title`}
                        {...registerEnTranslation(
                          `highlights.${highlight.id}.title`
                        )}
                        defaultValue={
                          (
                            enTranslationHighlights[highlight.id] as
                              | { title: string; description: string }
                              | undefined
                          )?.title || ""
                        }
                        disabled={updateTranslationMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`highlight-en-${highlight.id}-description`}
                      >
                        {t("description1Label")}
                      </Label>
                      <Textarea
                        id={`highlight-en-${highlight.id}-description`}
                        {...registerEnTranslation(
                          `highlights.${highlight.id}.description`
                        )}
                        defaultValue={
                          enTranslationHighlights[highlight.id]?.description ||
                          ""
                        }
                        rows={2}
                        disabled={updateTranslationMutation.isPending}
                      />
                    </div>
                  </div>
                ))}
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
                <Label htmlFor="description1-ar">
                  {t("description1Label")}
                </Label>
                <Textarea
                  id="description1-ar"
                  {...registerArTranslation("description1")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.description1 && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.description1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description2-ar">
                  {t("description2Label")}
                </Label>
                <Textarea
                  id="description2-ar"
                  {...registerArTranslation("description2")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.description2 && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.description2.message}
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

              <div className="space-y-4">
                <Label>{t("highlightsLabels")}</Label>
                {highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <Label className="text-base font-semibold">
                      {t("highlight")}: {highlight.id}
                    </Label>
                    <div className="space-y-2">
                      <Label htmlFor={`highlight-ar-${highlight.id}-title`}>
                        {t("titleLabel")}
                      </Label>
                      <Input
                        id={`highlight-ar-${highlight.id}-title`}
                        {...registerArTranslation(
                          `highlights.${highlight.id}.title`
                        )}
                        defaultValue={
                          (
                            arTranslationHighlights[highlight.id] as
                              | { title: string; description: string }
                              | undefined
                          )?.title || ""
                        }
                        disabled={updateTranslationMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`highlight-ar-${highlight.id}-description`}
                      >
                        {t("description1Label")}
                      </Label>
                      <Textarea
                        id={`highlight-ar-${highlight.id}-description`}
                        {...registerArTranslation(
                          `highlights.${highlight.id}.description`
                        )}
                        defaultValue={
                          arTranslationHighlights[highlight.id]?.description ||
                          ""
                        }
                        rows={2}
                        disabled={updateTranslationMutation.isPending}
                      />
                    </div>
                  </div>
                ))}
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
