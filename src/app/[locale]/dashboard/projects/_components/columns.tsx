"use client";

import { IProject } from "@/modules/projects/projects-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";

import Image from "next/image";

export const useColumns = (): ColumnDef<IProject>[] => {
  const t = useTranslations("dashboard.projects.columns");
  const tStatus = useTranslations("dashboard.projects.status");
  const tType = useTranslations("dashboard.projects.type");
  const locale = useLocale();

  return [
    {
      accessorKey: "thumbnailUrl",
      header: t("thumbnail"),
      cell: ({ row }) => {
        const thumbnailUrl = row.original.thumbnailUrl;
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        const fallbackTranslation = row.original.translations?.[0];
        const title =
          translation?.title || fallbackTranslation?.title || "Project Image";

        return thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            width={60}
            height={40}
            className="rounded object-cover size-10"
          />
        ) : (
          <div className="flex h-10 w-15 items-center justify-center rounded bg-muted text-xs">
            No Image
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: t("title"),
      cell: ({ row }) => {
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        // Fallback to other language if current locale not found
        const fallbackTranslation = row.original.translations?.[0];
        const title =
          translation?.title || fallbackTranslation?.title || row.original.slug;
        return <span className="font-medium">{title}</span>;
      },
    },
    {
      accessorKey: "slug",
      header: t("slug"),
      cell: ({ row }) => (
        <code className="rounded bg-muted px-2 py-1 text-xs">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "projectType",
      header: t("type"),
      cell: ({ row }) => {
        const type = row.original.projectType;
        return (
          <Badge variant="outline" className="capitalize">
            {tType(type)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<
          string,
          "default" | "secondary" | "destructive" | "outline"
        > = {
          draft: "secondary",
          in_progress: "default",
          published: "default",
          archived: "destructive",
        };

        return (
          <Badge variant={variants[status] || "default"}>
            {tStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isFeatured",
      header: t("featured"),
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Badge variant="default">Featured</Badge>
        ) : null,
    },
    {
      accessorKey: "stats",
      header: t("stats"),
      cell: ({ row }) => (
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>👁 {row.original.viewCount}</span>
          <span>❤️ {row.original.likeCount}</span>
          <span>💬 {row.original.commentCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ row }) => format(new Date(row.original.createdAt), "PP"),
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => <DataTableActions project={row.original} />,
    },
  ];
};
