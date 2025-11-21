"use client";

import { IUser } from "@/modules/users/users-type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

import { DataTableActions } from "./data-table-actions";

export const useColumns = (): ColumnDef<IUser>[] => {
  const t = useTranslations("common.columns");

  return [
    {
      accessorKey: "firstName",
      header: t("firstName"),
    },
    {
      accessorKey: "lastName",
      header: t("lastName"),
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "phone",
      header: t("phone"),
    },
    {
      accessorKey: "role",
      header: t("role"),
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ row }) => format(new Date(row.original.createdAt), "PP"),
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => <DataTableActions user={row.original} />,
    },
  ];
};
