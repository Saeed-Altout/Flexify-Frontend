"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProjectsDataTable } from "../projects-data-table";
import type { Project } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

interface ProjectsTableCardProps {
  columns: ColumnDef<Project>[];
  data: Project[];
  isLoading: boolean;
  error: Error | null;
  mounted: boolean;
  pageCount: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPaginationChange: (page: number) => void;
}

export function ProjectsTableCard({
  columns,
  data,
  isLoading,
  error,
  mounted,
  pageCount,
  totalCount,
  currentPage,
  pageSize,
  onPaginationChange,
}: ProjectsTableCardProps) {
  const tTable = useTranslations("auth.projects.dashboard.table");

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-destructive">
            Error loading projects: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mounted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <ProjectsDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pageCount={pageCount}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPaginationChange={onPaginationChange}
          translations={{
            noResults: tTable("noResults") as string,
            showing: tTable("showing", {
              from: String((currentPage - 1) * pageSize + 1),
              to: String(Math.min(currentPage * pageSize, totalCount)),
              total: String(totalCount),
            }) as string,
            page: tTable("page", {
              current: String(currentPage),
              total: String(pageCount),
            }) as string,
            firstPage: tTable("firstPage") as string,
            previousPage: tTable("previousPage") as string,
            nextPage: tTable("nextPage") as string,
            lastPage: tTable("lastPage") as string,
          }}
        />
      </CardContent>
    </Card>
  );
}

