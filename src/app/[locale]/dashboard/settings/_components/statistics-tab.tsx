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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type {
  IStatisticsSettings,
  IStatisticsTranslation,
} from "@/modules/site-settings/site-settings-type";

const statisticsSettingsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        value: z.number().int().min(0),
        suffix: z.string().optional(),
        icon: z.string(),
      })
    )
    .min(1, "At least one statistic is required"),
});

const statisticsTranslationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  items: z.record(
    z.string(),
    z.object({
      label: z.string().min(1, "Label is required"),
    })
  ),
});

type StatisticsSettingsFormValues = z.infer<typeof statisticsSettingsSchema>;
type StatisticsTranslationFormValues = z.infer<
  typeof statisticsTranslationSchema
>;

export function StatisticsTab() {
  const t = useTranslations("dashboard.settings.statistics");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("statistics");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("statistics");
  const updateSettingsMutation = useUpdateSiteSettingMutation();
  const updateTranslationMutation = useUpdateSiteSettingTranslationMutation();

  const statisticsSetting = settingsData?.data?.data;
  const statisticsValue = statisticsSetting?.value as
    | IStatisticsSettings
    | undefined;

  // Get translations for both locales
  const translations = translationData?.data?.data?.translations || [];
  const enTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "en"
  )?.value as IStatisticsTranslation | undefined;
  const arTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "ar"
  )?.value as IStatisticsTranslation | undefined;

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: settingsErrors },
    watch: watchSettings,
    setValue: setSettingsValue,
  } = useForm<StatisticsSettingsFormValues>({
    resolver: zodResolver(statisticsSettingsSchema),
    defaultValues: {
      items: statisticsValue?.items || [],
    },
    values: statisticsValue
      ? {
          items: statisticsValue.items,
        }
      : undefined,
  });

  const {
    register: registerEnTranslation,
    handleSubmit: handleSubmitEnTranslation,
    formState: { errors: enTranslationErrors },
    watch: watchEnTranslation,
    setValue: setEnTranslationValue,
  } = useForm<StatisticsTranslationFormValues>({
    resolver: zodResolver(statisticsTranslationSchema),
    defaultValues: {
      title: enTranslation?.title || "",
      description: enTranslation?.description || "",
      items: enTranslation?.items || {},
    },
    values: enTranslation
      ? {
          title: enTranslation.title,
          description: enTranslation.description,
          items: enTranslation.items,
        }
      : undefined,
  });

  const {
    register: registerArTranslation,
    handleSubmit: handleSubmitArTranslation,
    formState: { errors: arTranslationErrors },
    watch: watchArTranslation,
    setValue: setArTranslationValue,
  } = useForm<StatisticsTranslationFormValues>({
    resolver: zodResolver(statisticsTranslationSchema),
    defaultValues: {
      title: arTranslation?.title || "",
      description: arTranslation?.description || "",
      items: arTranslation?.items || {},
    },
    values: arTranslation
      ? {
          title: arTranslation.title,
          description: arTranslation.description,
          items: arTranslation.items,
        }
      : undefined,
  });

  const items = watchSettings("items");
  const enTranslationItems = watchEnTranslation("items");
  const arTranslationItems = watchArTranslation("items");

  const addStatistic = () => {
    const newId = `stat-${Date.now()}`;
    setSettingsValue("items", [
      ...items,
      { id: newId, value: 0, suffix: "+", icon: "briefcase" },
    ]);
    setEnTranslationValue(`items.${newId}.label` as any, "");
    setArTranslationValue(`items.${newId}.label` as any, "");
  };

  const removeStatistic = (id: string) => {
    setSettingsValue(
      "items",
      items.filter((item) => item.id !== id)
    );
    const newEnItems = { ...enTranslationItems };
    const newArItems = { ...arTranslationItems };
    delete newEnItems[id];
    delete newArItems[id];
    setEnTranslationValue("items", newEnItems);
    setArTranslationValue("items", newArItems);
  };

  const onSettingsSubmit = async (values: StatisticsSettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync({
        key: "statistics",
        data: {
          value: {
            items: values.items,
          },
        },
      });
      toast.success(t("settingsUpdateSuccess"));
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onEnTranslationSubmit = async (
    values: StatisticsTranslationFormValues
  ) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "statistics",
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

  const onArTranslationSubmit = async (
    values: StatisticsTranslationFormValues
  ) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "statistics",
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("settingsTitle")}</CardTitle>
                <CardDescription>{t("settingsDescription")}</CardDescription>
              </div>
              <Button type="button" onClick={addStatistic} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("addStatistic")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitSettings(onSettingsSubmit)}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {t("statistic")} {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStatistic(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <input
                    type="hidden"
                    {...registerSettings(`items.${index}.id`)}
                    value={item.id}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{t("valueLabel")}</Label>
                      <Input
                        type="number"
                        {...registerSettings(`items.${index}.value`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("suffixLabel")}</Label>
                      <Input
                        {...registerSettings(`items.${index}.suffix`)}
                        placeholder="+"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("iconLabel")}</Label>
                    <Input
                      {...registerSettings(`items.${index}.icon`)}
                      placeholder="briefcase"
                    />
                  </div>
                </div>
              ))}

              {settingsErrors.items && (
                <p className="text-sm text-destructive">
                  {settingsErrors.items.message}
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
                <Label htmlFor="description-en">{t("descriptionLabel")}</Label>
                <Textarea
                  id="description-en"
                  {...registerEnTranslation("description")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.description && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>{t("itemsLabels")}</Label>
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <Label htmlFor={`item-en-${item.id}`}>
                      {t("labelFor")} {item.id}
                    </Label>
                    <Input
                      id={`item-en-${item.id}`}
                      {...registerEnTranslation(`items.${item.id}.label`)}
                      defaultValue={
                        (
                          enTranslationItems[item.id] as
                            | { label: string }
                            | undefined
                        )?.label || ""
                      }
                      disabled={updateTranslationMutation.isPending}
                    />
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
                <Label htmlFor="description-ar">{t("descriptionLabel")}</Label>
                <Textarea
                  id="description-ar"
                  {...registerArTranslation("description")}
                  rows={3}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.description && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>{t("itemsLabels")}</Label>
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <Label htmlFor={`item-ar-${item.id}`}>
                      {t("labelFor")} {item.id}
                    </Label>
                    <Input
                      id={`item-ar-${item.id}`}
                      {...registerArTranslation(`items.${item.id}.label`)}
                      defaultValue={
                        (
                          arTranslationItems[item.id] as
                            | { label: string }
                            | undefined
                        )?.label || ""
                      }
                      disabled={updateTranslationMutation.isPending}
                    />
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
