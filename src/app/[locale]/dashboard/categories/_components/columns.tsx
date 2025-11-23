"use client";

import { ICategory } from "@/modules/categories/categories-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { DataTableActions } from "./data-table-actions";
import { getIconComponent } from "@/utils/icon-utils";

export const useColumns = (): ColumnDef<ICategory>[] => {
  const t = useTranslations("dashboard.categories.columns");

  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.name}</span>;
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
      accessorKey: "description",
      header: t("description") || "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return description ? (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
            {description}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
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
      cell: ({ row }) => <DataTableActions category={row.original} />,
    },
  ];
};

