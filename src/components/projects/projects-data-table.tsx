"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import type { Project } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

interface ProjectsDataTableProps {
  columns: ColumnDef<Project>[];
  data: Project[];
  isLoading: boolean;
  pageCount: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPaginationChange: (page: number) => void;
  translations: {
    noResults: string;
    showing: string;
    page: string;
  };
}

export function ProjectsDataTable({
  columns,
  data,
  isLoading,
  pageCount,
  totalCount,
  currentPage,
  pageSize,
  onPaginationChange,
  translations,
}: ProjectsDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pageCount={pageCount}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      onPaginationChange={onPaginationChange}
    >
      <DataTable.Container>
        <DataTable.Content />
      </DataTable.Container>
      <DataTable.Pagination>
        <DataTable.PaginationInfo
          translations={{
            showing: translations.showing,
            noResults: translations.noResults,
          }}
        />
        <DataTable.PaginationControls
          translations={{ page: translations.page }}
        />
      </DataTable.Pagination>
    </DataTable>
  );
}
