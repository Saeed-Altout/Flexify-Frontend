"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus } from "lucide-react";

import { useCategoriesQuery } from "@/modules/categories/categories-hook";

import { useColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function CategoriesPageClient() {
  const t = useTranslations("dashboard.categories");
  const router = useRouter();
  const columns = useColumns();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCategoriesQuery({
    search: search || undefined,
    page,
    limit,
  });

  const categories = useMemo(() => data?.data?.data || [], [data]);
  const meta = useMemo(() => data?.data?.meta, [data]);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading title={t("title")} description={t("description")} />
        <Button
          onClick={() => router.push("/dashboard/categories/create")}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createButton")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="p-3 md:p-4">
          <DataTableToolbar
            searchValue={search}
            onSearchChange={setSearch}
          />
        </div>
        <DataTable 
          columns={columns} 
          data={categories} 
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

