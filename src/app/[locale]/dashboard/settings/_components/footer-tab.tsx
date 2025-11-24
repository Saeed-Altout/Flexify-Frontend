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
});

const footerTranslationSchema = z.object({
  description: z.string().min(1, "Description is required"),
  contact: z.object({
    title: z.string().min(1, "Title is required"),
  }),
  columns: z.record(
    z.string(),
    z.object({
      title: z.string().min(1, "Column title is required"),
      links: z.record(z.string(), z.string().min(1, "Link label is required")),
    })
  ),
  copyright: z.string().min(1, "Copyright is required"),
  rights: z.string().min(1, "Rights is required"),
});

type FooterSettingsFormValues = z.infer<typeof footerSettingsSchema>;
type FooterTranslationFormValues = z.infer<typeof footerTranslationSchema>;

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

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: settingsErrors },
    watch: watchSettings,
    setValue: setSettingsValue,
  } = useForm<FooterSettingsFormValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
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
    },
    values:
      footerValue && enTranslation && arTranslation
        ? {
            socialLinks: footerValue.socialLinks.map((link) => ({
              icon: link.icon,
              href: link.href,
            })),
            columns: footerValue.columns.map((col) => ({
              key: col.key,
              titleEn:
                (
                  enTranslation.columns?.[col.key] as
                    | { title: string }
                    | undefined
                )?.title || "",
              titleAr:
                (
                  arTranslation.columns?.[col.key] as
                    | { title: string }
                    | undefined
                )?.title || "",
              links: col.links.map((link) => {
                // Find the label by matching the key
                const enLinks =
                  (
                    enTranslation.columns?.[col.key] as
                      | { links: Record<string, string> }
                      | undefined
                  )?.links || {};
                const arLinks =
                  (
                    arTranslation.columns?.[col.key] as
                      | { links: Record<string, string> }
                      | undefined
                  )?.links || {};

                const linkKey = link.key;
                const labelEn = enLinks[linkKey] || "";
                const labelAr = arLinks[linkKey] || "";

                return {
                  href: link.href,
                  labelEn: labelEn || "",
                  labelAr: labelAr || "",
                };
              }),
            })),
            contact: footerValue.contact,
          }
        : undefined,
  });

  const {
    register: registerEnTranslation,
    handleSubmit: handleSubmitEnTranslation,
    formState: { errors: enTranslationErrors },
    watch: watchEnTranslation,
  } = useForm<FooterTranslationFormValues>({
    resolver: zodResolver(footerTranslationSchema),
    defaultValues: {
      description: enTranslation?.description || "",
      contact: enTranslation?.contact || { title: "" },
      columns: enTranslation?.columns || {},
      copyright: enTranslation?.copyright || "",
      rights: enTranslation?.rights || "",
    },
    values: enTranslation
      ? {
          description: enTranslation.description,
          contact: enTranslation.contact,
          columns: enTranslation.columns || {},
          copyright: enTranslation.copyright,
          rights: enTranslation.rights,
        }
      : undefined,
  });

  const {
    register: registerArTranslation,
    handleSubmit: handleSubmitArTranslation,
    formState: { errors: arTranslationErrors },
    watch: watchArTranslation,
  } = useForm<FooterTranslationFormValues>({
    resolver: zodResolver(footerTranslationSchema),
    defaultValues: {
      description: arTranslation?.description || "",
      contact: arTranslation?.contact || { title: "" },
      columns: arTranslation?.columns || {},
      copyright: arTranslation?.copyright || "",
      rights: arTranslation?.rights || "",
    },
    values: arTranslation
      ? {
          description: arTranslation.description,
          contact: arTranslation.contact,
          columns: arTranslation.columns || {},
          copyright: arTranslation.copyright,
          rights: arTranslation.rights,
        }
      : undefined,
  });

  const socialLinks = watchSettings("socialLinks");
  const columns = watchSettings("columns");
  const enTranslationColumns = watchEnTranslation("columns");
  const arTranslationColumns = watchArTranslation("columns");

  const addSocialLink = () => {
    setSettingsValue("socialLinks", [...socialLinks, { icon: "", href: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSettingsValue(
      "socialLinks",
      socialLinks.filter((_, i) => i !== index)
    );
  };

  const addColumn = () => {
    setSettingsValue("columns", [
      ...columns,
      { titleEn: "", titleAr: "", links: [] },
    ]);
  };

  const removeColumn = (index: number) => {
    setSettingsValue(
      "columns",
      columns.filter((_, i) => i !== index)
    );
  };

  const addLinkItem = (columnIndex: number) => {
    const column = columns[columnIndex];
    setSettingsValue(`columns.${columnIndex}.links`, [
      ...column.links,
      { href: "", labelEn: "", labelAr: "" },
    ]);
  };

  const removeLinkItem = (columnIndex: number, linkIndex: number) => {
    const column = columns[columnIndex];
    setSettingsValue(
      `columns.${columnIndex}.links`,
      column.links.filter((_, i) => i !== linkIndex)
    );
  };

  const onSettingsSubmit = async (values: FooterSettingsFormValues) => {
    try {
      // Separate settings and translations
      // Generate keys from English labels (lowercase, replace spaces with underscores)
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

      // Prepare translations for both languages
      const enTranslationValue = {
        description: enTranslation?.description || "",
        contact: enTranslation?.contact || { title: "" },
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
        copyright: enTranslation?.copyright || "",
        rights: enTranslation?.rights || "",
      };

      const arTranslationValue = {
        description: arTranslation?.description || "",
        contact: arTranslation?.contact || { title: "" },
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
        copyright: arTranslation?.copyright || "",
        rights: arTranslation?.rights || "",
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

  const onEnTranslationSubmit = async (values: FooterTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "footer",
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

  const onArTranslationSubmit = async (values: FooterTranslationFormValues) => {
    try {
      await updateTranslationMutation.mutateAsync({
        key: "footer",
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
              className="space-y-6"
            >
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
                          setSettingsValue(
                            `socialLinks.${index}.icon`,
                            iconName
                          )
                        }
                      />
                      <Input
                        {...registerSettings(`socialLinks.${index}.href`)}
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
                          {...registerSettings(
                            `columns.${columnIndex}.titleEn`
                          )}
                          placeholder="English title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Title (AR)</Label>
                        <Input
                          {...registerSettings(
                            `columns.${columnIndex}.titleAr`
                          )}
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
                              {...registerSettings(
                                `columns.${columnIndex}.links.${linkIndex}.href`
                              )}
                              placeholder={t("urlPlaceholder")}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeLinkItem(columnIndex, linkIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              {...registerSettings(
                                `columns.${columnIndex}.links.${linkIndex}.labelEn`
                              )}
                              placeholder="Label (EN)"
                            />
                            <Input
                              {...registerSettings(
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
                    {...registerSettings("contact.email")}
                    type="email"
                    placeholder={t("emailPlaceholder")}
                  />
                  <Input
                    {...registerSettings("contact.phone")}
                    placeholder={t("phonePlaceholder")}
                  />
                  <Input
                    {...registerSettings("contact.location")}
                    placeholder={t("locationPlaceholder")}
                  />
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="contactTitle-en">
                  {t("contactTitleLabel")}
                </Label>
                <Input
                  id="contactTitle-en"
                  {...registerEnTranslation("contact.title")}
                  disabled={updateTranslationMutation.isPending}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("columnsTranslations")}
                </Label>
                {columns.map((column, colIdx) => {
                  // Generate column key from titleEn
                  const colKey =
                    column.titleEn
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "") || `column_${colIdx}`;
                  const columnTranslation = (enTranslationColumns[colKey] as
                    | { title: string; links: Record<string, string> }
                    | undefined) || { title: "", links: {} };
                  return (
                    <div
                      key={colIdx}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`column-title-en-${colIdx}`}>
                          {t("columnTitleLabel")}
                        </Label>
                        <Input
                          id={`column-title-en-${colIdx}`}
                          {...registerEnTranslation(`columns.${colKey}.title`)}
                          defaultValue={columnTranslation.title}
                          disabled={updateTranslationMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2 pl-4 border-l-2">
                        <Label className="text-sm">{t("linksLabels")}</Label>
                        {column.links.map((link, linkIdx) => {
                          // Generate key from labelEn
                          const linkKey =
                            link.labelEn
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, "") || `link_${linkIdx}`;
                          return (
                            <div key={linkIdx} className="space-y-2">
                              <Label htmlFor={`link-en-${colIdx}-${linkIdx}`}>
                                {link.href}
                              </Label>
                              <Input
                                id={`link-en-${colIdx}-${linkIdx}`}
                                {...registerEnTranslation(
                                  `columns.${colKey}.links.${linkKey}`
                                )}
                                defaultValue={
                                  columnTranslation.links[linkKey] || ""
                                }
                                disabled={updateTranslationMutation.isPending}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright-en">{t("copyrightLabel")}</Label>
                <Input
                  id="copyright-en"
                  {...registerEnTranslation("copyright")}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.copyright && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.copyright.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rights-en">{t("rightsLabel")}</Label>
                <Input
                  id="rights-en"
                  {...registerEnTranslation("rights")}
                  disabled={updateTranslationMutation.isPending}
                />
                {enTranslationErrors.rights && (
                  <p className="text-sm text-destructive">
                    {enTranslationErrors.rights.message}
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

              <div className="space-y-2">
                <Label htmlFor="contactTitle-ar">
                  {t("contactTitleLabel")}
                </Label>
                <Input
                  id="contactTitle-ar"
                  {...registerArTranslation("contact.title")}
                  disabled={updateTranslationMutation.isPending}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("columnsTranslations")}
                </Label>
                {columns.map((column, colIdx) => {
                  // Generate column key from titleEn
                  const colKey =
                    column.titleEn
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "") || `column_${colIdx}`;
                  const columnTranslation = (arTranslationColumns[colKey] as
                    | { title: string; links: Record<string, string> }
                    | undefined) || { title: "", links: {} };
                  return (
                    <div
                      key={colIdx}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`column-title-ar-${colIdx}`}>
                          {t("columnTitleLabel")}
                        </Label>
                        <Input
                          id={`column-title-ar-${colIdx}`}
                          {...registerArTranslation(`columns.${colKey}.title`)}
                          defaultValue={columnTranslation.title}
                          disabled={updateTranslationMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2 pl-4 border-l-2">
                        <Label className="text-sm">{t("linksLabels")}</Label>
                        {column.links.map((link, linkIdx) => {
                          // Generate key from labelEn
                          const linkKey =
                            link.labelEn
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, "") || `link_${linkIdx}`;
                          return (
                            <div key={linkIdx} className="space-y-2">
                              <Label htmlFor={`link-ar-${colIdx}-${linkIdx}`}>
                                {link.href}
                              </Label>
                              <Input
                                id={`link-ar-${colIdx}-${linkIdx}`}
                                {...registerArTranslation(
                                  `columns.${colKey}.links.${linkKey}`
                                )}
                                defaultValue={
                                  columnTranslation.links[linkKey] || ""
                                }
                                disabled={updateTranslationMutation.isPending}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright-ar">{t("copyrightLabel")}</Label>
                <Input
                  id="copyright-ar"
                  {...registerArTranslation("copyright")}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.copyright && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.copyright.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rights-ar">{t("rightsLabel")}</Label>
                <Input
                  id="rights-ar"
                  {...registerArTranslation("rights")}
                  disabled={updateTranslationMutation.isPending}
                />
                {arTranslationErrors.rights && (
                  <p className="text-sm text-destructive">
                    {arTranslationErrors.rights.message}
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
