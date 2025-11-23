"use client";

import { use, useState } from "react";
import { useProjectQuery } from "@/modules/projects/projects-hook";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageViewer } from "@/components/ui/image-viewer";
import {
  ArrowLeft,
  Edit,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Link as LinkIcon,
  Images,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.projects.detail");
  const tStatus = useTranslations("dashboard.projects.status");
  const tType = useTranslations("dashboard.projects.type");

  const { data, isLoading, error } = useProjectQuery(id);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (isLoading) {
    return (
      <LoadingState
        title={t("loading.title")}
        description={t("loading.description")}
      />
    );
  }

  if (error || !data?.data?.data) {
    return (
      <ErrorState
        title={t("error.title")}
        description={t("error.description")}
      />
    );
  }

  const project = data.data.data;
  const currentTranslation = project.translations?.find(
    (t) => t.locale === locale
  );

  // Prepare images for viewer (include thumbnail if exists, then gallery images)
  const allImages = [];
  if (project.thumbnailUrl) {
    allImages.push({
      id: "thumbnail",
      url: project.thumbnailUrl,
      alt: currentTranslation?.title || "Project thumbnail",
    });
  }
  if (project.images && project.images.length > 0) {
    project.images.forEach((img) => {
      allImages.push({
        id: img.id,
        url: img.imageUrl,
        alt: img.altText || currentTranslation?.title || "Project image",
      });
    });
  }

  const handleImageClick = (index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {currentTranslation?.title || "Untitled"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("createdAt")}: {format(new Date(project.createdAt), "PPP")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/projects/${id}/images`)}
          >
            <Images className="mr-2 h-4 w-4" />
            {t("manageImages") || "Manage Images"}
          </Button>
          <Button onClick={() => router.push(`/dashboard/projects/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("views")}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.viewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("likes")}</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.likeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("shares")}</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.shareCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("comments")}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.commentCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Thumbnail */}
          {project.thumbnailUrl && (
            <Card className="p-2">
              <CardContent className="p-0">
                <div
                  className="relative h-[400px] w-full cursor-pointer overflow-hidden rounded-lg group"
                  onClick={() => handleImageClick(0)}
                >
                  <Image
                    src={project.thumbnailUrl}
                    alt={currentTranslation?.title || "Project"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Language Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentTranslation?.title || "Project Content"}
              </CardTitle>
            </CardHeader>
            <CardContent
              className="space-y-4"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {currentTranslation?.shortDescription && (
                <div>
                  <h3 className="mb-2 font-semibold">
                    {t("shortDescription")}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentTranslation.shortDescription}
                  </p>
                </div>
              )}
              {currentTranslation?.description && (
                <div>
                  <h3 className="mb-2 font-semibold">{t("description")}</h3>
                  <p className="text-muted-foreground">
                    {currentTranslation.description}
                  </p>
                </div>
              )}
              {currentTranslation?.content && (
                <div>
                  <h3 className="mb-2 font-semibold">{t("content")}</h3>
                  <div className="prose max-w-none text-muted-foreground">
                    {currentTranslation.content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images Gallery */}
          {project.images && project.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("gallery")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.images.map((image, index) => {
                    const viewerIndex = project.thumbnailUrl
                      ? index + 1
                      : index;
                    return (
                      <div
                        key={image.id}
                        className="relative h-40 w-full cursor-pointer overflow-hidden rounded-lg group"
                        onClick={() => handleImageClick(viewerIndex)}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.altText || "Project image"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("projectInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">{t("slug")}</p>
                <code className="mt-1 block rounded bg-muted px-2 py-1 text-xs">
                  {project.slug}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium">{t("status")}</p>
                <Badge className="mt-1">{tStatus(project.status)}</Badge>
              </div>

              <div>
                <p className="text-sm font-medium">{t("type")}</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {tType(project.projectType)}
                </Badge>
              </div>

              {project.isFeatured && (
                <div>
                  <Badge variant="default">{t("featured")}</Badge>
                </div>
              )}

              {project.startDate && (
                <div>
                  <p className="text-sm font-medium">{t("startDate")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(new Date(project.startDate), "PPP")}
                  </p>
                </div>
              )}

              {project.endDate && (
                <div>
                  <p className="text-sm font-medium">{t("endDate")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(new Date(project.endDate), "PPP")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("technologies")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories */}
          {project.categories && project.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("categories")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("links")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {link.label || link.linkType}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Image Viewer */}
      {allImages.length > 0 && (
        <ImageViewer
          images={allImages}
          initialIndex={initialIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
