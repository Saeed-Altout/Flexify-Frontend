"use client";

import { ITestimonial } from "@/modules/testimonials/testimonials-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";
import Image from "next/image";

export const useColumns = (): ColumnDef<ITestimonial>[] => {
  const t = useTranslations("dashboard.testimonials.columns");
  const locale = useLocale();

  return [
    {
      accessorKey: "avatarUrl",
      header: t("avatar"),
      cell: ({ row }) => {
        const avatarUrl = row.original.avatarUrl;
        return avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs">
            {t("noAvatar")}
          </div>
        );
      },
    },
    {
      accessorKey: "authorName",
      header: t("author"),
      cell: ({ row }) => {
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        const fallbackTranslation = row.original.translations?.[0];
        const authorName =
          translation?.authorName || fallbackTranslation?.authorName || "-";
        return <span className="font-medium">{authorName}</span>;
      },
    },
    {
      accessorKey: "content",
      header: t("content"),
      cell: ({ row }) => {
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        const fallbackTranslation = row.original.translations?.[0];
        const content =
          translation?.content || fallbackTranslation?.content || "-";
        return (
          <p className="max-w-md truncate text-sm text-muted-foreground">
            {content}
          </p>
        );
      },
    },
    {
      accessorKey: "rating",
      header: t("rating"),
      cell: ({ row }) =>
        row.original.rating ? (
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{row.original.rating}/5</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        ),
    },
    {
      accessorKey: "isApproved",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={row.original.isApproved ? "default" : "secondary"}>
          {row.original.isApproved ? t("approved") : t("pending")}
        </Badge>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: t("featured"),
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Badge variant="default">{t("yes")}</Badge>
        ) : null,
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ row }) => format(new Date(row.original.createdAt), "PP"),
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => <DataTableActions testimonial={row.original} />,
    },
  ];
};

