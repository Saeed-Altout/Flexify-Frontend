"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations, useLocale } from "next-intl";
import { useProject } from "../hooks/use-project-queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Github,
  Star,
  Heart,
  Calendar,
  Code,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate } from "../utils/format";

interface ProjectPreviewDialogProps {
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectPreviewDialog({
  projectId,
  open,
  onOpenChange,
}: ProjectPreviewDialogProps) {
  const t = useTranslations("auth.projects.dashboard.preview");
  const locale = useLocale();
  const { data: project, isLoading, error } = useProject(projectId);
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());

  // Get translation for current locale
  const translation = project?.translations?.find((t) => t.language === locale);
  const projectTitle = translation?.title || project?.translations?.[0]?.title || "Untitled";
  const projectSummary = translation?.summary || project?.translations?.[0]?.summary || "";
  const projectDescription = translation?.description || project?.translations?.[0]?.description || "";
  const projectArchitecture = translation?.architecture || project?.translations?.[0]?.architecture || null;
  const projectFeatures = translation?.features || project?.translations?.[0]?.features || [];

  if (!open || !projectId) return null;

  const handleImageError = (src: string) => {
    setImageErrors((prev) => new Set(prev).add(src));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {t("error")}: {error.message}
          </div>
        ) : project ? (
          <div className="space-y-6 py-4">
            {/* Main Image */}
            {project.main_image && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
                {imageErrors.has(project.main_image) ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">Image not available</p>
                  </div>
                ) : (
                  <img
                    src={project.main_image}
                    alt={projectTitle}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(project.main_image!)}
                  />
                )}
              </div>
            )}

            {/* Title and Meta */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{projectTitle}</h2>
                  <p className="text-muted-foreground mt-1">
                    {projectSummary}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {project.is_published ? (
                    <Badge variant="default">{t("published")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("draft")}</Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {project.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.average_rating.toFixed(1)}</span>
                    <span>({project.total_ratings})</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  <span>{project.total_likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t("techStack")}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{t("description")}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {projectDescription}
              </p>
            </div>

            {/* Role */}
            {project.role && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t("role")}</h3>
                <p className="text-sm text-muted-foreground">{project.role}</p>
              </div>
            )}

            {/* Architecture */}
            {projectArchitecture && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t("architecture")}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {projectArchitecture}
                </p>
              </div>
            )}

            {/* Features */}
            {projectFeatures && projectFeatures.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t("features")}</h3>
                <div className="flex flex-wrap gap-2">
                  {projectFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Images Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {t("images")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border bg-muted"
                    >
                      {imageErrors.has(image) ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                          <p className="text-xs">Image {index + 1}</p>
                        </div>
                      ) : (
                        <img
                          src={image}
                          alt={`${projectTitle} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(image)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Links */}
            <div className="flex flex-wrap gap-2">
              {project.github_url && (
                <Button variant="outline" size="sm">
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      {t("github")}
                    </span>
                  </a>
                </Button>
              )}
              {project.github_backend_url && (
                <Button variant="outline" size="sm">
                  <a
                    href={project.github_backend_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {t("backendCode")}
                    </span>
                  </a>
                </Button>
              )}
              {project.live_demo_url && (
                <Button variant="outline" size="sm">
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t("liveDemo")}
                    </span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

