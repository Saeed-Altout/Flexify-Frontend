"use client";

import { ITechnology } from "@/modules/technologies/technologies-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";
import { getIconComponent } from "@/utils/icon-utils";

export const useColumns = (): ColumnDef<ITechnology>[] => {
  const t = useTranslations("dashboard.technologies.columns");

  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
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
      accessorKey: "description",
      header: t("description") || "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs line-clamp-2">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: t("category") || "Category",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.category || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "orderIndex",
      header: t("order") || "Order",
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
      cell: ({ row }) => <DataTableActions technology={row.original} />,
    },
  ];
};

