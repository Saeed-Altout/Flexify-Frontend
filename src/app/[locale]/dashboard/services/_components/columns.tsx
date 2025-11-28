"use client";

import { IService } from "@/modules/services/services-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";
import { getIconComponent } from "@/utils/icon-utils";

export const useColumns = (): ColumnDef<IService>[] => {
  const t = useTranslations("dashboard.services.columns");
  const locale = useLocale();

  return [
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
      accessorKey: "icon",
      header: t("icon") || "Icon",
      cell: ({ row }) => {
        const IconComponent = getIconComponent(row.original.icon);
        return IconComponent ? (
          <IconComponent className="h-5 w-5" />
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
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

