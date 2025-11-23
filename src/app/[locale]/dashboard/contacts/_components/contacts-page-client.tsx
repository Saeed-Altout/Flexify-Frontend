"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useContactsQuery } from "@/modules/contacts/contacts-hook";
import { ContactStatus } from "@/modules/contacts/contacts-type";

import { useColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function ContactsPageClient() {
  const t = useTranslations("dashboard.contacts");
  const columns = useColumns();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useContactsQuery({
    search: search || undefined,
    status:
      statusFilter !== "all" ? (statusFilter as ContactStatus) : undefined,
    page,
    limit,
  });

  const contacts = useMemo(() => data?.data?.data || [], [data]);
  const meta = useMemo(() => data?.data?.meta, [data]);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading title={t("title")} description={t("description")} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="p-3 md:p-4">
          <DataTableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
        <DataTable 
          columns={columns} 
          data={contacts} 
          isLoading={isLoading}
        />
        {meta && (
          <DataTablePagination
            meta={meta}
            onPageChange={setPage}
            onPageLimitChange={setLimit}
          />
        )}
      </div>
    </div>
  );
}

