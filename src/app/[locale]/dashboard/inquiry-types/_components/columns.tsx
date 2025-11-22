"use client";

import { IInquiryType } from "@/modules/inquiry-types/inquiry-types-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";

export const useColumns = (): ColumnDef<IInquiryType>[] => {
  const t = useTranslations("dashboard.inquiryTypes.columns");
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
      header: t("icon"),
      cell: ({ row }) =>
        row.original.icon ? (
          <span className="text-lg">{row.original.icon}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
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
      cell: ({ row }) => <DataTableActions inquiryType={row.original} />,
    },
  ];
};

