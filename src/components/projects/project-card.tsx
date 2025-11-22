"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IProject } from "@/modules/projects/projects-type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconEye,
  IconHeart,
  IconShare,
  IconCalendar,
  IconArrowRight,
} from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: IProject;
  index?: number;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function ProjectCard({
  project,
  index = 0,
  variant = "default",
  className,
}: ProjectCardProps) {
  const locale = useLocale();
  const translation = project.translations?.find((t) => t.locale === locale);
  const title = translation?.title || "Untitled Project";
  const description = translation?.shortDescription || translation?.description;
  const thumbnailUrl = project.thumbnailUrl;

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn("group", className)}
    >
      <Card className="h-full overflow-hidden border-border hover:shadow-lg transition-all duration-300 p-2">
        <Link href={`/projects/${project.slug}`}>
          {/* Thumbnail */}
          <div
            className={cn(
              "relative overflow-hidden bg-muted rounded-lg",
              isFeatured ? "h-64" : isCompact ? "h-40" : "h-48"
            )}
          >
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
                <IconCalendar className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Featured Badge */}
            {project.isFeatured && (
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            {/* Stats Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-4 text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
                <IconEye className="w-4 h-4" />
                <span className="font-medium">{project.viewCount}</span>
              </div>
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
                <IconHeart className="w-4 h-4" />
                <span className="font-medium">{project.likeCount}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className={cn("p-4", isCompact && "p-3")}>
            <div className="space-y-3">
              {/* Title & Type */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={cn(
                      "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
                      isFeatured ? "text-xl" : isCompact ? "text-sm" : "text-lg"
                    )}
                  >
                    {title}
                  </h3>
                  <IconArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.projectType.replace("_", " ")}
                </Badge>
              </div>

              {/* Description */}
              {description && !isCompact && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tech.name}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Footer Stats */}
              {!isCompact && (
                <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconEye className="w-3.5 h-3.5" />
                    <span>{project.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconHeart className="w-3.5 h-3.5" />
                    <span>{project.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconShare className="w-3.5 h-3.5" />
                    <span>{project.shareCount}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
