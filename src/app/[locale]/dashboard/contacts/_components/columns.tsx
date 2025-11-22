"use client";

import { IContact, ContactStatus } from "@/modules/contacts/contacts-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "./data-table-actions";

export const useColumns = (): ColumnDef<IContact>[] => {
  const t = useTranslations("dashboard.contacts.columns");
  const tStatus = useTranslations("dashboard.contacts.status");

  const statusVariants: Record<
    ContactStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    new: "default",
    read: "secondary",
    replied: "outline",
    archived: "destructive",
  };

  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => (
        <a
          href={`mailto:${row.original.email}`}
          className="text-blue-600 hover:underline"
        >
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: "phone",
      header: t("phone"),
      cell: ({ row }) =>
        row.original.phone ? (
          <a
            href={`tel:${row.original.phone}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.phone}
          </a>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        ),
    },
    {
      accessorKey: "subject",
      header: t("subject"),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.subject || (
            <span className="text-muted-foreground">-</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={statusVariants[row.original.status] || "default"}>
          {tStatus(row.original.status)}
        </Badge>
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
      cell: ({ row }) => <DataTableActions contact={row.original} />,
    },
  ];
};

