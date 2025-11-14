"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as z from "zod";
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
import { FileUpload } from "@/components/shared/file-upload";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface EditProjectModalProps {
  children: React.ReactNode;
}

export function EditProjectModal({ children }: EditProjectModalProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("auth.projects.dashboard.form");

  const [techStack, setTechStack] = React.useState<string[]>([]);
  const [techInput, setTechInput] = React.useState("");
  const [enFeaturesInput, setEnFeaturesInput] = React.useState("");
  const [arFeaturesInput, setArFeaturesInput] = React.useState("");

  const formSchema = z.object({
    tech_stack: z.array(z.string().min(1)),
    role: z.string().min(1, "Role is required"),
    github_url: z.url("Invalid URL").optional(),
    github_backend_url: z.url("Invalid URL").optional(),
    live_demo_url: z.url("Invalid URL").optional(),
    main_image: z.url("Invalid URL").optional(),
    images: z.array(z.url("Invalid URL")).optional(),
    is_published: z.boolean(),
    translations: z.array(
      z.object({
        language: z.enum(["en", "ar"]),
        title: z.string().min(1, "Title is required"),
        summary: z.string().min(1, "Summary is required"),
        description: z.string().min(1, "Description is required"),
        architecture: z.string().optional(),
        features: z.array(z.string()),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tech_stack: [],
      role: "",
      images: [],
      is_published: false,
      translations: [
        {
          language: "en",
          title: "",
          summary: "",
          description: "",
          features: [],
          architecture: "",
        },
        {
          language: "ar",
          title: "",
          summary: "",
          description: "",
          features: [],
          architecture: "",
        },
      ],
      github_url: "",
      github_backend_url: "",
      live_demo_url: "",
      main_image: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new project to your portfolio. Fill in all the required
            information.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              form.setValue("tech_stack", [
                                ...form.getValues("tech_stack"),
                                techInput,
                              ]);
                            }
                          }}
                          placeholder={t("techStackPlaceholder")}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            form.setValue("tech_stack", [
                              ...form.getValues("tech_stack"),
                              techInput,
                            ]);
                          }}
                          variant="outline"
                        >
                          {t("techStackAdd")}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="gap-1"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue(
                                  "tech_stack",
                                  form
                                    .getValues("tech_stack")
                                    .filter((t) => t !== tech)
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
              <h3 className="text-sm font-semibold">
                {t("translationsSection")}
              </h3>
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
                            placeholder={t(
                              "translationArchitecturePlaceholder"
                            )}
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
                                onChange={(e) =>
                                  setEnFeaturesInput(e.target.value)
                                }
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
                                placeholder={t(
                                  "translationFeaturesPlaceholder"
                                )}
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
                                {t("techStackAdd")}
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
                            placeholder={t(
                              "translationArchitecturePlaceholder"
                            )}
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
                                onChange={(e) =>
                                  setArFeaturesInput(e.target.value)
                                }
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
                                placeholder={t(
                                  "translationFeaturesPlaceholder"
                                )}
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
                                {t("techStackAdd")}
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
                    <FormDescription>
                      {t("publishedDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("create")}</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
