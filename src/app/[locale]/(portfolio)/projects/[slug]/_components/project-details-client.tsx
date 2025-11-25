"use client";

import { use, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  useProjectBySlugQuery,
  useToggleInteractionMutation,
  useIncrementViewMutation,
} from "@/modules/projects/projects-hook";
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
  const hasIncrementedView = useRef(false);

  const { data, isLoading } = useProjectBySlugQuery(resolvedParams.slug);
  const toggleInteraction = useToggleInteractionMutation();
  const incrementView = useIncrementViewMutation();
  const user = useAuthStore((state) => state.user);

  const project = data?.data?.data?.project;
  const userInteraction = data?.data?.data?.userInteraction;
  const translation = project?.translations?.find((t) => t.locale === locale);

  // Increment view count only once per session
  useEffect(() => {
    if (project?.id && !hasIncrementedView.current) {
      const viewKey = `project_view_${project.id}`;
      const hasViewed = sessionStorage.getItem(viewKey);

      if (!hasViewed) {
        incrementView.mutate(project.id);
        sessionStorage.setItem(viewKey, "true");
        hasIncrementedView.current = true;
      }
    }
  }, [project?.id, incrementView]);

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
        className="mb-4 sm:mb-6"
      >
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Link href="/projects">
            <IconArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{t("backToProjects")}</span>
            <span className="sm:hidden">{t("back")}</span>
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
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={project.thumbnailUrl}
              alt={translation.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
          </div>
        ) : (
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <IconCalendar className="w-16 h-16 sm:w-24 sm:h-24 text-muted-foreground/50" />
          </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              {project.isFeatured && (
                <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                  {t("featured")}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs sm:text-sm">
                {project.projectType.replace("_", " ")}
              </Badge>
              {project.categories?.slice(0, 3).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-xs sm:text-sm"
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <Button
                variant={userInteraction?.hasLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={toggleInteraction.isPending}
                className="text-xs sm:text-sm"
              >
                <IconHeart
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2",
                    userInteraction?.hasLiked && "fill-current"
                  )}
                />
                {project.likeCount}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-xs sm:text-sm"
              >
                <IconShare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t("share")}</span>
              </Button>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ml-auto">
                <div className="flex items-center gap-1">
                  <IconEye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{project.viewCount}</span>
                </div>
                {project.startDate && (
                  <div className="flex items-center gap-1">
                    <IconCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      {format(new Date(project.startDate), "MMM yyyy")}
                    </span>
                    <span className="sm:hidden">
                      {format(new Date(project.startDate), "MMM yy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Title, Description, and Short Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent
                className="p-4 sm:p-6"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  {translation.title}
                </h1>

                {translation.shortDescription && (
                  <p className="text-base sm:text-lg text-muted-foreground mb-4">
                    {translation.shortDescription}
                  </p>
                )}

                {translation.description && (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-headings:scroll-mt-20"
                    dangerouslySetInnerHTML={{
                      __html: translation.description,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Content */}
          {translation.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div
                    className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-headings:scroll-mt-20"
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
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
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
            transition={{ delay: 0.4 }}
          >
            <ProjectComments projectId={project.id} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                    {t("technologies")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
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
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                    {t("links")}
                  </h3>
                  <div className="space-y-2">
                    {project.links.map((link) => {
                      const IconComponent = getLinkIcon(link.linkType);
                      return (
                        <Button
                          key={link.id}
                          variant="outline"
                          className="w-full justify-start text-xs sm:text-sm"
                          size="sm"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">
                              {link.label || link.linkType.replace("_", " ")}
                            </span>
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
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  {t("info")}
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("status")}:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  {project.startDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {t("startDate")}:
                      </span>
                      <span className="text-right">
                        <span className="hidden sm:inline">
                          {format(new Date(project.startDate), "MMM dd, yyyy")}
                        </span>
                        <span className="sm:hidden">
                          {format(new Date(project.startDate), "MMM dd")}
                        </span>
                      </span>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {t("endDate")}:
                      </span>
                      <span className="text-right">
                        <span className="hidden sm:inline">
                          {format(new Date(project.endDate), "MMM dd, yyyy")}
                        </span>
                        <span className="sm:hidden">
                          {format(new Date(project.endDate), "MMM dd")}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("views")}:</span>
                    <span>{project.viewCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
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
