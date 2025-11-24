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
        labelEn: z.string().min(1, "English label is required"),
        labelAr: z.string().min(1, "Arabic label is required"),
      })
    )
    .min(1, "At least one statistic is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
});

type StatisticsSettingsFormValues = z.infer<typeof statisticsSettingsSchema>;

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

  // Prepare form values from existing data
  const getFormValues = (): StatisticsSettingsFormValues => {
    const items = (statisticsValue?.items || []).map((item) => {
      const enLabel = enTranslation?.items?.[item.id]?.label || "";
      const arLabel = arTranslation?.items?.[item.id]?.label || "";
      return {
        ...item,
        labelEn: enLabel,
        labelAr: arLabel,
      };
    });

    return {
      items,
      titleEn: enTranslation?.title || "",
      titleAr: arTranslation?.title || "",
      descriptionEn: enTranslation?.description || "",
      descriptionAr: arTranslation?.description || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StatisticsSettingsFormValues>({
    resolver: zodResolver(statisticsSettingsSchema),
    defaultValues: getFormValues(),
    values: statisticsValue || enTranslation || arTranslation ? getFormValues() : undefined,
  });

  const items = watch("items");

  const addStatistic = () => {
    const newId = `stat-${Date.now()}`;
    setValue("items", [
      ...items,
      {
        id: newId,
        value: 0,
        suffix: "+",
        icon: "Briefcase",
        labelEn: "",
        labelAr: "",
      },
    ]);
  };

  const removeStatistic = (id: string) => {
    setValue(
      "items",
      items.filter((item) => item.id !== id)
    );
  };

  const onSubmit = async (values: StatisticsSettingsFormValues) => {
    try {
      // Update settings (items only)
      await updateSettingsMutation.mutateAsync({
        key: "statistics",
        data: {
          value: {
            items: values.items.map(({ labelEn, labelAr, ...item }) => item),
          },
        },
      });

      // Update EN translation
      const enTranslationValue: IStatisticsTranslation = {
        title: values.titleEn,
        description: values.descriptionEn,
        items: values.items.reduce(
          (acc, item) => {
            acc[item.id] = { label: item.labelEn };
            return acc;
          },
          {} as Record<string, { label: string }>
        ),
      };

      await updateTranslationMutation.mutateAsync({
        key: "statistics",
        data: {
          locale: "en",
          value: enTranslationValue,
        },
      });

      // Update AR translation
      const arTranslationValue: IStatisticsTranslation = {
        title: values.titleAr,
        description: values.descriptionAr,
        items: values.items.reduce(
          (acc, item) => {
            acc[item.id] = { label: item.labelAr };
            return acc;
          },
          {} as Record<string, { label: string }>
        ),
      };

      await updateTranslationMutation.mutateAsync({
        key: "statistics",
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
          <Button type="button" onClick={addStatistic} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("addStatistic")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Title and Description */}
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
                <Label>{t("descriptionLabel")} (EN)</Label>
                <Textarea {...register("descriptionEn")} rows={3} />
                {errors.descriptionEn && (
                  <p className="text-sm text-destructive">
                    {errors.descriptionEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("descriptionLabel")} (AR)</Label>
                <Textarea {...register("descriptionAr")} rows={3} />
                {errors.descriptionAr && (
                  <p className="text-sm text-destructive">
                    {errors.descriptionAr.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Items */}
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
                {...register(`items.${index}.id`)}
                value={item.id}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("valueLabel")}</Label>
                  <Input
                    type="number"
                    {...register(`items.${index}.value`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.value && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.value?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("suffixLabel")}</Label>
                  <Input
                    {...register(`items.${index}.suffix`)}
                    placeholder="+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("iconLabel")}</Label>
                <IconPicker
                  value={item.icon || ""}
                  onSelect={(iconName) => {
                    setValue(`items.${index}.icon`, iconName);
                  }}
                />
                {errors.items?.[index]?.icon && (
                  <p className="text-sm text-destructive">
                    {errors.items[index]?.icon?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("itemsLabels")} (EN)</Label>
                  <Input {...register(`items.${index}.labelEn`)} />
                  {errors.items?.[index]?.labelEn && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.labelEn?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("itemsLabels")} (AR)</Label>
                  <Input {...register(`items.${index}.labelAr`)} />
                  {errors.items?.[index]?.labelAr && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.labelAr?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {errors.items && (
            <p className="text-sm text-destructive">
              {errors.items.message}
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
