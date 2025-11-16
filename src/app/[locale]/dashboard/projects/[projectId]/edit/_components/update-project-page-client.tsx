"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { TechStackField } from "../../_components/tech-stack-field";
import { RoleField } from "../../_components/role-field";
import { TranslationsField } from "../../_components/translations-field";
import { MainImageField } from "../../_components/main-image-field";
import { ImagesField } from "../../_components/images-field";
import { GithubUrlField } from "../../_components/github-url-field";
import { LiveDemoField } from "../../_components/live-demo-field";
import { PublishedField } from "../../_components/published-field";
import { GithubBackendUrlField } from "../../_components/github-backend-url-field";
import { useUpdateProjectMutation } from "../../../../../../../modules/projects/hooks/use-project-mutations";
import { Project } from "@/types";

interface UpdateProjectModalProps {
  children: React.ReactNode;
  project: Project;
}

export function UpdateProjectModal({
  children,
  project,
}: UpdateProjectModalProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("auth.projects.dashboard.form");

  const { mutate: updateProject, isPending } = useUpdateProjectMutation();

  const formSchema = z.object({
    tech_stack: z.array(z.string().min(1)),
    role: z.string().min(1, "Role is required"),
    github_url: z.url("Invalid URL").min(1, "GitHub URL is required"),
    github_backend_url: z.string().optional(),
    live_demo_url: z.string().min(1, "Live demo URL is required"),
    main_image: z.string().optional(),
    images: z.array(z.string().min(1, "Image is required")).optional(),
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
      tech_stack: project.tech_stack || [],
      role: project.role || "",
      images: project.images || [],
      is_published: project.is_published || false,
      translations:
        project.translations?.map((translation) => ({
          language: translation.language,
          title: translation.title,
          summary: translation.summary,
          description: translation.description,
          features: translation.features,
          architecture: translation.architecture || undefined,
        })) || [],
      github_url: project.github_url || "",
      github_backend_url: project.github_backend_url || "",
      live_demo_url: project.live_demo_url || "",
      main_image: project.main_image || "",
    },
  });

  console.log(project);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateProject(
      { id: project.id, data },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="pb-0">
          <SheetTitle>Edit Project</SheetTitle>
          <SheetDescription>
            Edit the project details. Fill in all the required information.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[75vh] sm:max-h-[78vh] overflow-y-auto px-4 space-y-4">
              <TechStackField />
              <RoleField />
              <Separator />
              <TranslationsField />
              <Separator />
              <div className="space-y-4">
                <MainImageField />
                <ImagesField />
              </div>
              <Separator />
              <div className="space-y-4">
                <GithubUrlField />
                <GithubBackendUrlField />
                <LiveDemoField />
              </div>
              <PublishedField />
            </div>

            <SheetFooter className="flex-row pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending} loading={isPending}>
                {t("create")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
