"use client";

import { IService } from "@/modules/services/services-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";
import Image from "next/image";

export const useColumns = (): ColumnDef<IService>[] => {
  const t = useTranslations("dashboard.services.columns");
  const locale = useLocale();

  return [
    {
      accessorKey: "imageUrl",
      header: t("image"),
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrl;
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        const fallbackTranslation = row.original.translations?.[0];
        const name =
          translation?.name || fallbackTranslation?.name || row.original.slug;

        return imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={60}
            height={40}
            className="rounded object-cover size-10"
          />
        ) : (
          <div className="flex h-10 w-15 items-center justify-center rounded bg-muted text-xs">
            {t("noImage")}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        const translation = row.original.translations?.find(
          (t) => t.locale === locale
        );
        const fallbackTranslation = row.original.translations?.[0];
        const name =
          translation?.name || fallbackTranslation?.name || row.original.slug;
        return <span className="font-medium">{name}</span>;
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
      accessorKey: "isActive",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? t("active") : t("inactive")}
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
      accessorKey: "orderIndex",
      header: t("order"),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.orderIndex}</span>
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
      cell: ({ row }) => <DataTableActions service={row.original} />,
    },
  ];
};

