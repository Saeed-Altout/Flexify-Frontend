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
  const { data, isLoading } = useUsersQuery({ search, role, page, limit });

  const users = useMemo(() => data?.data?.data || [], [data]);
  const meta = useMemo(() => data?.data?.meta || null, [data]);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading title={t("title")} description={t("description")} />
      <div className="overflow-hidden rounded-md border">
        <div className="p-3 md:p-4">
          <DataTableToolbar />
        </div>
        <DataTable 
          columns={columns} 
          data={users} 
          isLoading={isLoading}
        />
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
