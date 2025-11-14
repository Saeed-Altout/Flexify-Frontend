"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormDescription } from "@/components/ui/form";

export function TranslationsField() {
  const t = useTranslations("auth.projects.dashboard.form");
  const [enFeaturesInput, setEnFeaturesInput] = useState("");
  const [arFeaturesInput, setArFeaturesInput] = useState("");
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{t("translationsSection")}</h3>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en">{t("english")}</TabsTrigger>
          <TabsTrigger value="ar">{t("arabic")}</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="translations.0.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationTitle")} ({t("english")})
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("translationTitlePlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.0.summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationSummary")} ({t("english")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("translationSummaryPlaceholder")}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.0.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationDescription")} ({t("english")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("translationDescriptionPlaceholder")}
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.0.architecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationArchitecture")} ({t("english")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={t("translationArchitecturePlaceholder")}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  {t("translationArchitectureDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.0.features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationFeatures")} ({t("english")})
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={enFeaturesInput}
                        onChange={(e) => setEnFeaturesInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const currentFeatures = field.value || [];
                            if (
                              enFeaturesInput.trim() &&
                              !currentFeatures.includes(enFeaturesInput.trim())
                            ) {
                              field.onChange([
                                ...currentFeatures,
                                enFeaturesInput.trim(),
                              ]);
                              setEnFeaturesInput("");
                            }
                          }
                        }}
                        placeholder={t("translationFeaturesPlaceholder")}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const currentFeatures = field.value || [];
                          if (
                            enFeaturesInput.trim() &&
                            !currentFeatures.includes(enFeaturesInput.trim())
                          ) {
                            field.onChange([
                              ...currentFeatures,
                              enFeaturesInput.trim(),
                            ]);
                            setEnFeaturesInput("");
                          }
                        }}
                        variant="outline"
                      >
                        {t("techStackAdd")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(field.value || []).map(
                        (feature: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-1"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const currentFeatures = field.value || [];
                                field.onChange(
                                  currentFeatures.filter(
                                    (_: string, i: number) => i !== index
                                  )
                                );
                              }}
                              className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="ar" className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="translations.1.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationTitle")} ({t("arabic")})
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("translationTitlePlaceholder")}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.1.summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationSummary")} ({t("arabic")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("translationSummaryPlaceholder")}
                    rows={3}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.1.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationDescription")} ({t("arabic")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("translationDescriptionPlaceholder")}
                    rows={6}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.1.architecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationArchitecture")} ({t("arabic")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={t("translationArchitecturePlaceholder")}
                    rows={4}
                    dir="rtl"
                  />
                </FormControl>
                <FormDescription>
                  {t("translationArchitectureDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.1.features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("translationFeatures")} ({t("arabic")})
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={arFeaturesInput}
                        onChange={(e) => setArFeaturesInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const currentFeatures = field.value || [];
                            if (
                              arFeaturesInput.trim() &&
                              !currentFeatures.includes(arFeaturesInput.trim())
                            ) {
                              field.onChange([
                                ...currentFeatures,
                                arFeaturesInput.trim(),
                              ]);
                              setArFeaturesInput("");
                            }
                          }
                        }}
                        placeholder={t("translationFeaturesPlaceholder")}
                        dir="rtl"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const currentFeatures = field.value || [];
                          if (
                            arFeaturesInput.trim() &&
                            !currentFeatures.includes(arFeaturesInput.trim())
                          ) {
                            field.onChange([
                              ...currentFeatures,
                              arFeaturesInput.trim(),
                            ]);
                            setArFeaturesInput("");
                          }
                        }}
                        variant="outline"
                      >
                        {t("techStackAdd")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(field.value || []).map(
                        (feature: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-1"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const currentFeatures = field.value || [];
                                field.onChange(
                                  currentFeatures.filter(
                                    (_: string, i: number) => i !== index
                                  )
                                );
                              }}
                              className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
