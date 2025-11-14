"use client";

import { ProjectsDashboardProvider } from "@/modules/projects/context/projects-dashboard-context";
import { useProjectsTable } from "@/modules/projects/hooks/use-projects-table";
import { useProjectsDashboard } from "@/modules/projects/context/projects-dashboard-context";
import { ProjectsPageHeader } from "@/modules/projects/components/dashboard/projects-page-header";
import { ProjectsFiltersCard } from "@/modules/projects/components/dashboard/projects-filters-card";
import { ProjectsTableCard } from "@/modules/projects/components/dashboard/projects-table-card";
import { ProjectsDialogs } from "@/modules/projects/components/dashboard/projects-dialogs";
import { formatDate, truncate } from "@/modules/projects/utils/format";
import { useTranslations, useLocale } from "next-intl";

function ProjectsPageContent() {
  const tDashboard = useTranslations("auth.projects.dashboard");
  const tTable = useTranslations("auth.projects.dashboard.table");
  const locale = useLocale();
  const { mounted, handleCreate, handlePreview, handleEdit, handleDelete } =
    useProjectsDashboard();

  const {
    columns,
    data,
    isLoading,
    error,
    search,
    setSearch,
    page,
    setPage,
    limit,
    techStack,
    setTechStack,
    isPublished,
    setIsPublished,
  } = useProjectsTable({
    translations: {
      table: tTable as (
        key: string,
        values?: Record<string, unknown>
      ) => string,
      dashboard: tDashboard as (
        key: string,
        values?: Record<string, unknown>
      ) => string,
    },
    locale,
    mounted,
    onPreview: handlePreview,
    onEdit: handleEdit,
    onDelete: handleDelete,
    formatDate,
    truncate,
  });

  const handleClearFilters = () => {
    setSearch(null);
    setTechStack(null);
    setIsPublished(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <ProjectsPageHeader onCreateClick={handleCreate} />

      <ProjectsFiltersCard
        search={search}
        onSearchChange={setSearch}
        techStack={techStack}
        onTechStackChange={setTechStack}
        isPublished={isPublished}
        onIsPublishedChange={setIsPublished}
        onClearFilters={handleClearFilters}
        onPageReset={() => setPage(1)}
      />

      <ProjectsTableCard
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        error={error}
        mounted={mounted}
        pageCount={data?.meta?.totalPages || 1}
        totalCount={data?.meta?.total || 0}
        currentPage={page}
        pageSize={limit}
        onPaginationChange={setPage}
      />

      <ProjectsDialogs />
    </div>
  );
}

export function ProjectsPageClient() {
  return (
    <ProjectsDashboardProvider>
      <ProjectsPageContent />
    </ProjectsDashboardProvider>
  );
}
