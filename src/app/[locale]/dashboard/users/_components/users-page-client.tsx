"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { useQueryParams } from "@/hooks/use-query-params";
import { useUsersQuery } from "@/modules/users/users-hook";

import { useColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function UsersPageClient() {
  const t = useTranslations("dashboard.users");
  const columns = useColumns();

  const { search, role, page, limit, setPage, setLimit } = useQueryParams();
  const { data } = useUsersQuery({ search, role, page, limit });

  const users = useMemo(() => data?.data?.data || [], [data]);
  const meta = useMemo(() => data?.data?.meta || null, [data]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Heading title={t("title")} description={t("description")} />
      <div className="overflow-hidden rounded-md border">
        <DataTableToolbar />
        <DataTable columns={columns} data={users} />
        {meta && (
          <DataTablePagination
            meta={meta}
            onPageChange={(page) => setPage(page)}
            onPageLimitChange={(limit) => setLimit(limit)}
          />
        )}
      </div>
    </div>
  );
}
