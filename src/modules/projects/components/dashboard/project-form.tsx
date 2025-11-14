"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { projectSchema, type ProjectFormValues } from "../../utils/schema";
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
import { hasProjectChanges } from "../../utils/diff";
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

  );
}
