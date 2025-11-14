"use client";

import { useMemo } from "react";
import { useProjects } from "../components/dashboard/projects-context";
import { useProjects as useProjectsQuery } from "@/modules/projects/hooks/use-project-queries";

/**
 * Custom hook for managing projects table
 * Integrates query params with API calls
 */
export function useProjectsTable() {
  const { queryParams, setQueryParams } = useProjects();

  // Fetch projects with current query params
  const {
    data: projectsData,
    isLoading,
    error,
    isRefetching,
  } = useProjectsQuery(queryParams);

  // Extract data and meta
  const projects = projectsData?.data ?? [];
  const meta = projectsData?.meta;

  // Update query params helpers
  const updateQueryParams = useMemo(
    () => (updates: Partial<typeof queryParams>) => {
      setQueryParams({ ...queryParams, ...updates });
    },
    [queryParams, setQueryParams]
  );

  const setPage = (page: number) => {
    updateQueryParams({ page });
  };

  const setSearch = (search: string) => {
    updateQueryParams({ search: search || undefined, page: 1 });
  };

  const setSort = (sort_by: string, order: "ASC" | "DESC") => {
    updateQueryParams({ sort_by, order });
  };

  const setFilter = (key: keyof typeof queryParams, value: unknown) => {
    updateQueryParams({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      sort_by: "created_at",
      order: "DESC",
    });
  };

  return {
    // Data
    projects,
    meta,
    isLoading: isLoading || isRefetching,
    error,

    // Query params
    queryParams,

    // Actions
    setPage,
    setSearch,
    setSort,
    setFilter,
    clearFilters,
  };
}
