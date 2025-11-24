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
  IFooterSettings,
  IFooterTranslation,
} from "@/modules/site-settings/site-settings-type";

const footerSettingsSchema = z.object({
  socialLinks: z.array(
    z.object({
      icon: z.string(),
      href: z.string().url("Invalid URL"),
    })
  ),
  columns: z.array(
    z.object({
      titleEn: z.string().min(1, "English title is required"),
      titleAr: z.string().min(1, "Arabic title is required"),
      links: z.array(
        z.object({
          href: z.string().min(1, "URL is required"),
          labelEn: z.string().min(1, "English label is required"),
          labelAr: z.string().min(1, "Arabic label is required"),
        })
      ),
    })
  ),
  contact: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string(),
    location: z.string(),
  }),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  contactTitleEn: z.string().min(1, "English contact title is required"),
  contactTitleAr: z.string().min(1, "Arabic contact title is required"),
  copyrightEn: z.string().min(1, "English copyright is required"),
  copyrightAr: z.string().min(1, "Arabic copyright is required"),
  rightsEn: z.string().min(1, "English rights is required"),
  rightsAr: z.string().min(1, "Arabic rights is required"),
});

type FooterSettingsFormValues = z.infer<typeof footerSettingsSchema>;

export function FooterTab() {
  const t = useTranslations("dashboard.settings.footer");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("footer");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("footer");
  const updateSettingsMutation = useUpdateSiteSettingMutation();
  const updateTranslationMutation = useUpdateSiteSettingTranslationMutation();

  const footerSetting = settingsData?.data?.data;
  const footerValue = footerSetting?.value as IFooterSettings | undefined;

  // Get translations for both locales
  const translations = translationData?.data?.data?.translations || [];
  const enTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "en"
  )?.value as IFooterTranslation | undefined;
  const arTranslation = translations.find(
    (trans: { locale: string }) => trans.locale === "ar"
  )?.value as IFooterTranslation | undefined;

  // Prepare form values from existing data
  const getFormValues = (): FooterSettingsFormValues => {
    return {
      socialLinks: footerValue?.socialLinks || [],
      columns: (footerValue?.columns || []).map((col) => {
        const colKey = col.key;
        const enColTranslation = enTranslation?.columns?.[colKey] as
          | { title: string; links: Record<string, string> }
          | undefined;
        const arColTranslation = arTranslation?.columns?.[colKey] as
          | { title: string; links: Record<string, string> }
          | undefined;

        return {
          titleEn: enColTranslation?.title || "",
          titleAr: arColTranslation?.title || "",
          links: col.links.map((link) => {
            const linkKey = link.key;
            const labelEn = enColTranslation?.links?.[linkKey] || "";
            const labelAr = arColTranslation?.links?.[linkKey] || "";

            return {
              href: link.href,
              labelEn: labelEn || "",
              labelAr: labelAr || "",
            };
          }),
        };
      }),
      contact: footerValue?.contact || {
        email: "",
        phone: "",
        location: "",
      },
      descriptionEn: enTranslation?.description || "",
      descriptionAr: arTranslation?.description || "",
      contactTitleEn: enTranslation?.contact?.title || "",
      contactTitleAr: arTranslation?.contact?.title || "",
      copyrightEn: enTranslation?.copyright || "",
      copyrightAr: arTranslation?.copyright || "",
      rightsEn: enTranslation?.rights || "",
      rightsAr: arTranslation?.rights || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FooterSettingsFormValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: getFormValues(),
    values:
      footerValue || enTranslation || arTranslation
        ? getFormValues()
        : undefined,
  });

  const socialLinks = watch("socialLinks");
  const columns = watch("columns");

  const addSocialLink = () => {
    setValue("socialLinks", [...socialLinks, { icon: "", href: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setValue(
      "socialLinks",
      socialLinks.filter((_, i) => i !== index)
    );
  };

  const addColumn = () => {
    setValue("columns", [
      ...columns,
      { titleEn: "", titleAr: "", links: [] },
    ]);
  };

  const removeColumn = (index: number) => {
    setValue(
      "columns",
      columns.filter((_, i) => i !== index)
    );
  };

  const addLinkItem = (columnIndex: number) => {
    const column = columns[columnIndex];
    setValue(`columns.${columnIndex}.links`, [
      ...column.links,
      { href: "", labelEn: "", labelAr: "" },
    ]);
  };

  const removeLinkItem = (columnIndex: number, linkIndex: number) => {
    const column = columns[columnIndex];
    setValue(
      `columns.${columnIndex}.links`,
      column.links.filter((_, i) => i !== linkIndex)
    );
  };

  const onSubmit = async (values: FooterSettingsFormValues) => {
    try {
      // Generate keys from English labels
      const settingsValue = {
        socialLinks: values.socialLinks,
        columns: values.columns.map((col) => {
          const colKey =
            col.titleEn
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "") || `column-${Date.now()}`;
          return {
            key: colKey,
            links: col.links.map((link) => {
              const linkKey = link.labelEn
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
              return {
                href: link.href,
                key: linkKey || `link-${Date.now()}-${Math.random()}`,
              };
            }),
          };
        }),
        contact: values.contact,
      };

      // Update settings
      await updateSettingsMutation.mutateAsync({
        key: "footer",
        data: {
          value: settingsValue,
        },
      });

      // Update EN translation
      const enTranslationValue: IFooterTranslation = {
        description: values.descriptionEn,
        contact: {
          title: values.contactTitleEn,
        },
        columns: values.columns.reduce((acc, col) => {
          const colKey =
            col.titleEn
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "") || `column-${Date.now()}`;
          acc[colKey] = {
            title: col.titleEn,
            links: col.links.reduce((linkAcc, link) => {
              const linkKey = link.labelEn
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
              linkAcc[linkKey || `link-${Date.now()}-${Math.random()}`] =
                link.labelEn;
              return linkAcc;
            }, {} as Record<string, string>),
          };
          return acc;
        }, {} as Record<string, { title: string; links: Record<string, string> }>),
        copyright: values.copyrightEn,
        rights: values.rightsEn,
      };

      // Update AR translation
      const arTranslationValue: IFooterTranslation = {
        description: values.descriptionAr,
        contact: {
          title: values.contactTitleAr,
        },
        columns: values.columns.reduce((acc, col) => {
          const colKey =
            col.titleEn
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "") || `column-${Date.now()}`;
          acc[colKey] = {
            title: col.titleAr,
            links: col.links.reduce((linkAcc, link) => {
              const linkKey = link.labelEn
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
              linkAcc[linkKey || `link-${Date.now()}-${Math.random()}`] =
                link.labelAr;
              return linkAcc;
            }, {} as Record<string, string>),
          };
          return acc;
        }, {} as Record<string, { title: string; links: Record<string, string> }>),
        copyright: values.copyrightAr,
        rights: values.rightsAr,
      };

      // Update translations
      await Promise.all([
        updateTranslationMutation.mutateAsync({
          key: "footer",
          data: {
            locale: "en",
            value: enTranslationValue,
          },
        }),
        updateTranslationMutation.mutateAsync({
          key: "footer",
          data: {
            locale: "ar",
            value: arTranslationValue,
          },
        }),
      ]);

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
          {/* Section Content - Description, Contact Title, Copyright, Rights */}
          <div className="space-y-4 p-4 border rounded-lg">
            <Label className="text-base font-semibold">
              {t("translationTitle")}
            </Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("contactTitleLabel")} (EN)</Label>
                <Input {...register("contactTitleEn")} />
                {errors.contactTitleEn && (
                  <p className="text-sm text-destructive">
                    {errors.contactTitleEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("contactTitleLabel")} (AR)</Label>
                <Input {...register("contactTitleAr")} />
                {errors.contactTitleAr && (
                  <p className="text-sm text-destructive">
                    {errors.contactTitleAr.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("copyrightLabel")} (EN)</Label>
                <Input {...register("copyrightEn")} />
                {errors.copyrightEn && (
                  <p className="text-sm text-destructive">
                    {errors.copyrightEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("copyrightLabel")} (AR)</Label>
                <Input {...register("copyrightAr")} />
                {errors.copyrightAr && (
                  <p className="text-sm text-destructive">
                    {errors.copyrightAr.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("rightsLabel")} (EN)</Label>
                <Input {...register("rightsEn")} />
                {errors.rightsEn && (
                  <p className="text-sm text-destructive">
                    {errors.rightsEn.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("rightsLabel")} (AR)</Label>
                <Input {...register("rightsAr")} />
                {errors.rightsAr && (
                  <p className="text-sm text-destructive">
                    {errors.rightsAr.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {t("socialLinksLabel")}
              </Label>
              <Button type="button" onClick={addSocialLink} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("add")}
              </Button>
            </div>
            {socialLinks.map((_, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {t("socialLink")} {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <IconPicker
                    value={socialLinks[index]?.icon || ""}
                    onSelect={(iconName) =>
                      setValue(`socialLinks.${index}.icon`, iconName)
                    }
                  />
                  <Input
                    {...register(`socialLinks.${index}.href`)}
                    placeholder={t("urlPlaceholder")}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {t("columnsLabel")}
              </Label>
              <Button type="button" onClick={addColumn} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("addColumn")}
              </Button>
            </div>
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(columnIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Title (EN)</Label>
                    <Input
                      {...register(`columns.${columnIndex}.titleEn`)}
                      placeholder="English title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Title (AR)</Label>
                    <Input
                      {...register(`columns.${columnIndex}.titleAr`)}
                      placeholder="Arabic title"
                    />
                  </div>
                </div>
                <div className="space-y-2 pl-4 border-l-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t("links")}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLinkItem(columnIndex)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      {t("addLink")}
                    </Button>
                  </div>
                  {column.links.map((_, linkIndex) => (
                    <div
                      key={linkIndex}
                      className="space-y-2 p-2 border rounded"
                    >
                      <div className="flex gap-2 items-center">
                        <Input
                          {...register(
                            `columns.${columnIndex}.links.${linkIndex}.href`
                          )}
                          placeholder={t("urlPlaceholder")}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLinkItem(columnIndex, linkIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          {...register(
                            `columns.${columnIndex}.links.${linkIndex}.labelEn`
                          )}
                          placeholder="Label (EN)"
                        />
                        <Input
                          {...register(
                            `columns.${columnIndex}.links.${linkIndex}.labelAr`
                          )}
                          placeholder="Label (AR)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("contactLabel")}
            </Label>
            <div className="space-y-2">
              <Input
                {...register("contact.email")}
                type="email"
                placeholder={t("emailPlaceholder")}
              />
              <Input
                {...register("contact.phone")}
                placeholder={t("phonePlaceholder")}
              />
              <Input
                {...register("contact.location")}
                placeholder={t("locationPlaceholder")}
              />
            </div>
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
