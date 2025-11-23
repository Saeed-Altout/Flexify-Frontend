"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { useProjectBySlugQuery, useToggleInteractionMutation } from "@/modules/projects/projects-hook";
import { useAuthStore } from "@/stores/use-auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectComments } from "@/components/projects/project-comments";
import { toast } from "sonner";
import {
  IconCalendar,
  IconEye,
  IconHeart,
  IconShare,
  IconExternalLink,
  IconBrandGithub,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectDetailsClientProps {
  params: Promise<{ slug: string }>;
}

export function ProjectDetailsClient({ params }: ProjectDetailsClientProps) {
  const resolvedParams = use(params);
  const t = useTranslations("portfolio.projectDetails");
  const locale = useLocale();

  const { data, isLoading } = useProjectBySlugQuery(resolvedParams.slug);
  const toggleInteraction = useToggleInteractionMutation();
  const user = useAuthStore((state) => state.user);

  const project = data?.data?.data?.project;
  const userInteraction = data?.data?.data?.userInteraction;
  const translation = project?.translations?.find((t) => t.locale === locale);

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="space-y-8">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </main>
    );
  }

  if (!project || !translation) {
    return (
      <main className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("notFound")}</h1>
        <Button asChild variant="outline">
          <Link href="/projects">{t("backToProjects")}</Link>
        </Button>
      </main>
    );
  }

  const handleLike = () => {
    if (!user) {
      toast.error(t("loginRequired"));
      return;
    }
    toggleInteraction.mutate({
      projectId: project.id,
      interactionType: "like",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: translation.title,
        text: translation.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
    toggleInteraction.mutate({
      projectId: project.id,
      interactionType: "share",
    });
  };

  const getLinkIcon = (linkType: string) => {
    switch (linkType) {
      case "github":
      case "frontend_github":
      case "backend_github":
        return IconBrandGithub;
      default:
        return IconExternalLink;
    }
  };

  return (
    <main className="container py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            {t("backToProjects")}
          </Link>
        </Button>
      </motion.div>

      {/* Hero Section with Thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 rounded-lg overflow-hidden"
      >
        {project.thumbnailUrl ? (
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={project.thumbnailUrl}
              alt={translation.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          </div>
        ) : (
          <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <IconCalendar className="w-24 h-24 text-muted-foreground/50" />
          </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.isFeatured && (
                <Badge className="bg-primary text-primary-foreground">
                  {t("featured")}
                </Badge>
              )}
              <Badge variant="outline">
                {project.projectType.replace("_", " ")}
              </Badge>
              {project.categories?.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {translation.title}
            </h1>
            {translation.shortDescription && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                {translation.shortDescription}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={userInteraction?.hasLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={toggleInteraction.isPending}
              >
                <IconHeart
                  className={cn(
                    "w-4 h-4 mr-2",
                    userInteraction?.hasLiked && "fill-current"
                  )}
                />
                {project.likeCount}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <IconShare className="w-4 h-4 mr-2" />
                {t("share")}
              </Button>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <IconEye className="w-4 h-4" />
                  <span>{project.viewCount}</span>
                </div>
                {project.startDate && (
                  <div className="flex items-center gap-1">
                    <IconCalendar className="w-4 h-4" />
                    <span>
                      {format(new Date(project.startDate), "MMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {translation.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{t("description")}</h2>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: translation.description,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Full Content */}
          {translation.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: translation.content,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <ProjectGallery
                    images={project.images}
                    title={t("gallery")}
                    maxVisible={3}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ProjectComments projectId={project.id} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("technologies")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech.id} variant="secondary">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Links */}
          {project.links && project.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("links")}</h3>
                  <div className="space-y-2">
                    {project.links.map((link) => {
                      const IconComponent = getLinkIcon(link.linkType);
                      return (
                        <Button
                          key={link.id}
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {link.label || link.linkType.replace("_", " ")}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t("info")}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("status")}:</span>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  {project.startDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("startDate")}:</span>
                      <span>
                        {format(new Date(project.startDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("endDate")}:</span>
                      <span>
                        {format(new Date(project.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("views")}:</span>
                    <span>{project.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("likes")}:</span>
                    <span>{project.likeCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

