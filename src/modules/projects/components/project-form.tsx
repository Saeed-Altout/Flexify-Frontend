"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { projectSchema, type ProjectFormValues } from "../utils/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "./file-upload";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { hasProjectChanges } from "../utils/diff";
import type { Project } from "@/types";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const t = useTranslations("auth.projects.dashboard.form");
  const [techStack, setTechStack] = React.useState<string[]>(
    project?.tech_stack || []
  );
  const [techInput, setTechInput] = React.useState("");
  const [enFeaturesInput, setEnFeaturesInput] = React.useState("");
  const [arFeaturesInput, setArFeaturesInput] = React.useState("");

  // Initialize translations from project or create empty ones
  // Always ensure en is at index 0 and ar is at index 1
  const initializeTranslations = (): ProjectFormValues["translations"] => {
    const defaultTranslations: ProjectFormValues["translations"] = [
      {
        language: "en" as const,
        title: "",
        summary: "",
        description: "",
        architecture: "",
        features: [],
      },
      {
        language: "ar" as const,
        title: "",
        summary: "",
        description: "",
        architecture: "",
        features: [],
      },
    ];

    if (project?.translations && project.translations.length > 0) {
      const enTranslation = project.translations.find(
        (t) => t.language === "en"
      );
      const arTranslation = project.translations.find(
        (t) => t.language === "ar"
      );

      return [
        {
          language: "en" as const,
          title: enTranslation?.title || "",
          summary: enTranslation?.summary || "",
          description: enTranslation?.description || "",
          architecture: enTranslation?.architecture ?? "",
          features: enTranslation?.features || [],
        },
        {
          language: "ar" as const,
          title: arTranslation?.title || "",
          summary: arTranslation?.summary || "",
          description: arTranslation?.description || "",
          architecture: arTranslation?.architecture ?? "",
          features: arTranslation?.features || [],
        },
      ];
    }

    return defaultTranslations;
  };

  const form = useForm<ProjectFormValues>({
    // @ts-expect-error - Zod's default() doesn't change input type, but react-hook-form expects it
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tech_stack: project?.tech_stack || [],
      role: project?.role || "",
      github_url: project?.github_url || "",
      github_backend_url: project?.github_backend_url || "",
      live_demo_url: project?.live_demo_url || "",
      main_image: project?.main_image || "",
      images: project?.images || [],
      is_published: project?.is_published ?? false,
      translations: initializeTranslations(),
    },
  });

  // Update form when project changes (e.g., when editing and project data is loaded)
  React.useEffect(() => {
    if (project) {
      const translations = initializeTranslations();
      form.reset({
        tech_stack: project.tech_stack || [],
        role: project.role || "",
        github_url: project.github_url || "",
        github_backend_url: project.github_backend_url || "",
        live_demo_url: project.live_demo_url || "",
        main_image: project.main_image || "",
        images: project.images || [],
        is_published: project.is_published ?? false,
        translations: translations,
      });
      setTechStack(project.tech_stack || []);
      setEnFeaturesInput("");
      setArFeaturesInput("");
    } else {
      // Reset form when no project (creating new)
      form.reset({
        tech_stack: [],
        role: "",
        github_url: "",
        github_backend_url: "",
        live_demo_url: "",
        main_image: "",
        images: [],
        is_published: false,
        translations: [
          {
            language: "en" as const,
            title: "",
            summary: "",
            description: "",
            architecture: "",
            features: [],
          },
          {
            language: "ar" as const,
            title: "",
            summary: "",
            description: "",
            architecture: "",
            features: [],
          },
        ],
      });
      setTechStack([]);
      setEnFeaturesInput("");
      setArFeaturesInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id, project?.translations?.length]);

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      const newTech = [...techStack, techInput.trim()];
      setTechStack(newTech);
      form.setValue("tech_stack", newTech);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    const newTech = techStack.filter((t) => t !== tech);
    setTechStack(newTech);
    form.setValue("tech_stack", newTech);
  };

  // Watch form values to detect changes
  const formValues = form.watch();

  // Check if there are changes when editing
  const hasChanges = React.useMemo(() => {
    if (!project) return true; // Always allow submit for new projects
    try {
      // Transform form values to match ProjectFormValues format
      const currentFormData: ProjectFormValues = {
        ...formValues,
        tech_stack: techStack,
        images: formValues.images || [],
        translations: (formValues.translations || []).map((t) => ({
          ...t,
          features: t.features || [],
        })),
      };
      return hasProjectChanges(project, currentFormData);
    } catch {
      return true; // If comparison fails, allow submit
    }
  }, [formValues, techStack, project]);

  const handleFormSubmit = (data: ProjectFormValues) => {
    // Transform empty strings to undefined for optional URL fields
    // Filter out translations with empty required fields
    const validTranslations =
      data.translations?.filter((t) => t.title && t.summary && t.description) ||
      [];

    const transformedData: ProjectFormValues = {
      ...data,
      github_url: data.github_url === "" ? undefined : data.github_url,
      github_backend_url:
        data.github_backend_url === "" ? undefined : data.github_backend_url,
      live_demo_url: data.live_demo_url === "" ? undefined : data.live_demo_url,
      main_image: data.main_image === "" ? undefined : data.main_image,
      images: data.images || [],
      translations:
        validTranslations.length > 0
          ? (validTranslations.map((t) => ({
              ...t,
              features: t.features || [],
            })) as ProjectFormValues["translations"])
          : ([] as ProjectFormValues["translations"]),
    };
    onSubmit(transformedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="tech_stack"
          render={() => (
            <FormItem>
              <FormLabel>{t("techStack")}</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder={t("techStackPlaceholder")}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTech}
                      variant="outline"
                    >
                      {t("techStackAdd")}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("role")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("rolePlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{t("translationsSection")}</h3>
          <Tabs defaultValue="en" className="w-full">
            <TabsList>
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
                                  !currentFeatures.includes(
                                    enFeaturesInput.trim()
                                  )
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
                                !currentFeatures.includes(
                                  enFeaturesInput.trim()
                                )
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
                            {t("add")}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(field.value || []).map((feature, index) => (
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
                                      (_, i) => i !== index
                                    )
                                  );
                                }}
                                className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
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
                                  !currentFeatures.includes(
                                    arFeaturesInput.trim()
                                  )
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
                                !currentFeatures.includes(
                                  arFeaturesInput.trim()
                                )
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
                            {t("add")}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(field.value || []).map((feature, index) => (
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
                                      (_, i) => i !== index
                                    )
                                  );
                                }}
                                className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
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

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{t("mediaSection")}</h3>

          <FormField
            control={form.control}
            name="main_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("mainImage")}</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(
                        Array.isArray(value) ? value[0] : value || ""
                      );
                    }}
                    type="image"
                    label={t("mainImageLabel")}
                    description={t("mainImageDescription")}
                    error={form.formState.errors.main_image?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("images")}</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || []}
                    onChange={(value) => {
                      field.onChange(
                        Array.isArray(value) ? value : value ? [value] : []
                      );
                    }}
                    type="image"
                    multiple
                    maxFiles={10}
                    label={t("imagesLabel")}
                    description={t("imagesDescription")}
                    error={form.formState.errors.images?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("githubUrl")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder={t("githubUrlPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="live_demo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("liveDemoUrl")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder={t("liveDemoUrlPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("published")}</FormLabel>
                <FormDescription>{t("publishedDescription")}</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || (project && !hasChanges)}
          >
            {isLoading ? t("saving") : project ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
