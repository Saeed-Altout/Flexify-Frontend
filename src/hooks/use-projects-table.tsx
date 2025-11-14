"use client";

import * as React from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useProjects } from "@/modules/projects/hooks/use-project-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

type TranslationFunction = (
  key: string,
  values?: Record<string, unknown>
) => string;

interface UseProjectsTableOptions {
  translations: {
    table: TranslationFunction;
    dashboard: TranslationFunction;
  };
  locale: string;
  mounted: boolean;
  onPreview: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  formatDate: (date: Date) => string;
  truncate: (text: string, length: number) => string;
}

export function useProjectsTable({
  translations,
  locale,
  mounted,
  onPreview,
  onEdit,
  onDelete,
  formatDate,
  truncate,
}: UseProjectsTableOptions) {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [techStack, setTechStack] = useQueryState("tech_stack", parseAsString);
  const [isPublished, setIsPublished] = useQueryState(
    "is_published",
    parseAsString
  );

  const { data, isLoading, error } = useProjects({
    search: search || undefined,
    tech_stack: techStack || undefined,
    is_published:
      isPublished === "true"
        ? true
        : isPublished === "false"
        ? false
        : undefined,
    page,
    limit,
    sort_by: "created_at",
    order: "DESC",
  });

  const columns: ColumnDef<Project>[] = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: translations.table("title"),
        cell: ({ row }) => {
          const project = row.original;
          const translation = project.translations?.find(
            (t) => t.language === locale
          );
          const projectTitle =
            translation?.title ||
            project.translations?.[0]?.title ||
            "Untitled";
          const projectSummary =
            translation?.summary || project.translations?.[0]?.summary || "";
          return (
            <div className="flex flex-col">
              <span className="font-medium">{truncate(projectTitle, 40)}</span>
              <span className="text-xs text-muted-foreground">
                {truncate(projectSummary, 50)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "tech_stack",
        header: translations.table("techStack"),
        cell: ({ row }) => {
          const techStack = row.original.tech_stack || [];
          return (
            <div className="flex flex-wrap gap-1">
              {techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {techStack.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{techStack.length - 3}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: translations.table("role"),
        cell: ({ row }) => row.original.role,
      },
      {
        accessorKey: "average_rating",
        header: translations.table("rating"),
        cell: ({ row }) => {
          const rating = row.original.average_rating;
          return rating > 0 ? rating.toFixed(1) : "N/A";
        },
      },
      {
        accessorKey: "total_likes",
        header: translations.table("likes"),
        cell: ({ row }) => row.original.total_likes,
      },
      {
        accessorKey: "is_published",
        header: translations.table("status"),
        cell: ({ row }) => {
          const isPublished = row.original.is_published;
          return (
            <Badge variant={isPublished ? "default" : "outline"}>
              {isPublished
                ? translations.dashboard("published")
                : translations.dashboard("draft")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: translations.table("created"),
        cell: ({ row }) => {
          if (!mounted) return "—";
          return formatDate(row.original.created_at);
        },
      },
      {
        id: "actions",
        header: translations.table("actions"),
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onPreview(project)}
                title={translations.dashboard("previewButton")}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {project.live_demo_url && (
                <Link
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={translations.dashboard("viewLive")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(project)}
                title={translations.dashboard("edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(project)}
                title={translations.dashboard("delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [
      translations,
      locale,
      mounted,
      onPreview,
      onEdit,
      onDelete,
      formatDate,
      truncate,
    ]
  );

  return {
    columns,
    data,
    isLoading,
    error,
    search,
    setSearch,
    page,
    setPage,
    limit,
    techStack,
    setTechStack,
    isPublished,
    setIsPublished,
  };
}
