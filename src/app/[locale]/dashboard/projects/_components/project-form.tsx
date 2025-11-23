"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUploadProjectThumbnailMutation,
} from "@/modules/projects/projects-hook";
import { useTechnologiesQuery } from "@/modules/technologies/technologies-hook";
import { useCategoriesQuery } from "@/modules/categories/categories-hook";
import { ThumbnailUpload } from "./thumbnail-upload";
import { ProjectLinksManager } from "./project-links-manager";
import {
  IProject,
  ICreateProjectRequest,
  IProjectLink,
} from "@/modules/projects/projects-type";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  project?: IProject;
  mode: "create" | "edit";
}

const projectFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  projectType: z.enum(["personal", "client", "open_source"]),
  status: z.enum(["draft", "in_progress", "published", "archived"]),
  orderIndex: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // English Translation
  titleEn: z.string().min(1, "English title is required"),
  descriptionEn: z.string().optional(),
  shortDescriptionEn: z.string().max(500).optional(),
  contentEn: z.string().optional(),
  // Arabic Translation
  titleAr: z.string().min(1, "Arabic title is required"),
  descriptionAr: z.string().optional(),
  shortDescriptionAr: z.string().max(500).optional(),
  contentAr: z.string().optional(),
  // Relations
  technologyIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const t = useTranslations("dashboard.projects.form");
  const router = useRouter();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    project?.thumbnailUrl || null
  );
  const [links, setLinks] = useState<IProjectLink[]>(project?.links || []);

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const uploadThumbnailMutation = useUploadProjectThumbnailMutation();
  const { data: technologiesData } = useTechnologiesQuery();
  const { data: categoriesData } = useCategoriesQuery();

  // Extract technologies and categories from the response
  // Technologies response: { data: { data: ITechnology[] } }
  // Categories response: { data: { data: ICategory[] } }
  const technologies = technologiesData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];

  // Get translations
  const enTranslation = project?.translations?.find((t) => t.locale === "en");
  const arTranslation = project?.translations?.find((t) => t.locale === "ar");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      slug: project?.slug || "",
      projectType: project?.projectType || "personal",
      status: project?.status || "draft",
      orderIndex: project?.orderIndex || 0,
      isFeatured: project?.isFeatured || false,
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
      titleEn: enTranslation?.title || "",
      descriptionEn: enTranslation?.description || "",
      shortDescriptionEn: enTranslation?.shortDescription || "",
      contentEn: enTranslation?.content || "",
      titleAr: arTranslation?.title || "",
      descriptionAr: arTranslation?.description || "",
      shortDescriptionAr: arTranslation?.shortDescription || "",
      contentAr: arTranslation?.content || "",
      technologyIds: project?.technologies?.map((t) => t.id) || [],
      categoryIds: project?.categories?.map((c) => c.id) || [],
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    const baseData = {
      projectType: values.projectType,
      status: values.status,
      orderIndex: values.orderIndex,
      isFeatured: values.isFeatured,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      translations: [
        {
          locale: "en",
          title: values.titleEn,
          description: values.descriptionEn,
          shortDescription: values.shortDescriptionEn,
          content: values.contentEn,
        },
        {
          locale: "ar",
          title: values.titleAr,
          description: values.descriptionAr,
          shortDescription: values.shortDescriptionAr,
          content: values.contentAr,
        },
      ],
      technologyIds: values.technologyIds,
      categoryIds: values.categoryIds,
      links: links.map((link) => ({
        linkType: link.linkType,
        url: link.url,
        label: link.label || undefined,
        icon: link.icon || undefined,
        orderIndex: link.orderIndex,
      })),
    };

    if (mode === "create") {
      const createData: ICreateProjectRequest = {
        slug: values.slug,
        ...baseData,
      };

      const response = await createMutation.mutateAsync(createData);
      const projectId = response.data.data.id;

      // Upload thumbnail if provided
      if (thumbnailFile) {
        await uploadThumbnailMutation.mutateAsync({
          projectId,
          file: thumbnailFile,
        });
      }

      router.push("/dashboard/projects");
    } else if (project) {
      // For update, don't include slug
      await updateMutation.mutateAsync({ id: project.id, data: baseData });

      // Upload thumbnail if changed
      if (thumbnailFile) {
        await uploadThumbnailMutation.mutateAsync({
          projectId: project.id,
          file: thumbnailFile,
        });
      }

      router.push("/dashboard/projects");
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadThumbnailMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">{t("tabs.basic")}</TabsTrigger>
            <TabsTrigger value="translations">
              {t("tabs.translations")}
            </TabsTrigger>
            <TabsTrigger value="relations">{t("tabs.relations")}</TabsTrigger>
            <TabsTrigger value="links">{t("tabs.links")}</TabsTrigger>
            <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("basicInfo.title")}</CardTitle>
                <CardDescription>{t("basicInfo.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("slug.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("slug.placeholder")}
                          {...field}
                          disabled={mode === "edit"}
                        />
                      </FormControl>
                      <FormDescription>{t("slug.description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>{t("thumbnail.label")}</FormLabel>
                  <FormControl>
                    <ThumbnailUpload
                      currentThumbnail={project?.thumbnailUrl}
                      onFileSelect={(file) => {
                        setThumbnailFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setThumbnailPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                      onRemove={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
                      }}
                      isUploading={uploadThumbnailMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("thumbnail.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("startDate.label")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("endDate.label")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Translations Tab */}
          <TabsContent value="translations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("translations.english")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("title.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shortDescription.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("shortDescription.placeholder")}
                          {...field}
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("description.placeholder")}
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("content.placeholder")}
                          {...field}
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("translations.arabic")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("title.placeholder")}
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shortDescription.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("shortDescription.placeholder")}
                          {...field}
                          rows={2}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("description.placeholder")}
                          {...field}
                          rows={4}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("content.placeholder")}
                          {...field}
                          rows={8}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relations Tab */}
          <TabsContent value="relations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("technologies.title")}</CardTitle>
                <CardDescription>
                  {t("technologies.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="technologyIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => {
                          const isSelected = field.value?.includes(tech.id);
                          return (
                            <Badge
                              key={tech.id}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const current = field.value || [];
                                const newValue = isSelected
                                  ? current.filter((id) => id !== tech.id)
                                  : [...current, tech.id];
                                field.onChange(newValue);
                              }}
                            >
                              {tech.name}
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("categories.title")}</CardTitle>
                <CardDescription>{t("categories.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const isSelected = field.value?.includes(category.id);
                          return (
                            <Badge
                              key={category.id}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const current = field.value || [];
                                const newValue = isSelected
                                  ? current.filter((id) => id !== category.id)
                                  : [...current, category.id];
                                field.onChange(newValue);
                              }}
                            >
                              {category.name}
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("links.title")}</CardTitle>
                <CardDescription>{t("links.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectLinksManager links={links} onChange={setLinks} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.title")}</CardTitle>
                <CardDescription>{t("settings.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("projectType.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("projectType.placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">
                            {t("projectType.personal")}
                          </SelectItem>
                          <SelectItem value="client">
                            {t("projectType.client")}
                          </SelectItem>
                          <SelectItem value="open_source">
                            {t("projectType.openSource")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("status.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("status.placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            {t("status.draft")}
                          </SelectItem>
                          <SelectItem value="in_progress">
                            {t("status.inProgress")}
                          </SelectItem>
                          <SelectItem value="published">
                            {t("status.published")}
                          </SelectItem>
                          <SelectItem value="archived">
                            {t("status.archived")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("orderIndex.label")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {t("orderIndex.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("isFeatured.label")}</FormLabel>
                        <FormDescription>
                          {t("isFeatured.description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? t("create") : t("update")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
