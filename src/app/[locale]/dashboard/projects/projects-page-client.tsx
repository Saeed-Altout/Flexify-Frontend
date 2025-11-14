"use client";

import * as React from "react";
import { useProject } from "@/modules/projects/hooks/use-project-queries";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/modules/projects/hooks/use-project-mutations";
import { ProjectsDataTable } from "@/components/projects/projects-data-table";
import { useProjectsTable } from "@/hooks/use-projects-table";
import { ProjectFormSheet } from "@/components/projects/project-form-sheet";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectPreviewDialog } from "@/components/projects/project-preview-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Code,
  Filter,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Project } from "@/types";
import type { ProjectFormValues } from "@/modules/projects/utils/schema";
import { formatDate, truncate } from "@/modules/projects/utils/format";
import { getProjectChanges } from "@/modules/projects/utils/diff";
import { useTranslations, useLocale } from "next-intl";

export function ProjectsPageClient() {
  const t = useTranslations("auth.projects");
  const tDashboard = useTranslations("auth.projects.dashboard");
  const tTable = useTranslations("auth.projects.dashboard.table");
  const locale = useLocale();
  const [mounted, setMounted] = React.useState(false);
  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | null
  >(null);
  const [previewProjectId, setPreviewProjectId] = React.useState<string | null>(
    null
  );

  // Fetch full project data with translations when editing
  const { data: fullProjectData } = useProject(selectedProjectId);

  // Ensure component is mounted before rendering to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handlers
  const handleCreate = () => {
    setSelectedProject(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProjectId(project.id);
    setSelectedProject(project);
    setFormDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (project: Project) => {
    setPreviewProjectId(project.id);
    setPreviewDialogOpen(true);
  };

  // Extract table logic to hook
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

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();

  // Close sheet on successful mutations only (not on errors)
  React.useEffect(() => {
    if (
      createMutation.isSuccess &&
      createMutation.data &&
      createMutation.data.success === true
    ) {
      setFormDialogOpen(false);
      setSelectedProject(null);
      setSelectedProjectId(null);
    }
  }, [createMutation.isSuccess, createMutation.data]);

  React.useEffect(() => {
    if (
      updateMutation.isSuccess &&
      updateMutation.data &&
      updateMutation.data.success === true
    ) {
      setFormDialogOpen(false);
      setSelectedProject(null);
      setSelectedProjectId(null);
    }
  }, [updateMutation.isSuccess, updateMutation.data]);

  const handleFormSubmit = (formData: ProjectFormValues) => {
    if (selectedProject) {
      // Only send changed fields for updates to improve performance
      // Use fullProjectData if available (has translations), otherwise use selectedProject
      const originalProject = fullProjectData || selectedProject;
      const changes = getProjectChanges(originalProject, formData);
      updateMutation.mutate({
        id: selectedProject.id,
        data: changes,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t("description")}
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {tDashboard("newProject")}
          </Button>
        </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{tDashboard("filters")}</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("filtersTooltip") || "Filter projects by search, tech stack, or status"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={tDashboard("searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value || null)}
                    className="pl-9"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{tDashboard("searchTooltip") || "Search by project title or description"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={tDashboard("techStackPlaceholder")}
                    value={techStack || ""}
                    onChange={(e) => setTechStack(e.target.value || null)}
                    className="pl-9"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{tDashboard("techStackTooltip") || "Filter by technology (e.g., React, Node.js)"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Select
                  value={isPublished || "all"}
                  onValueChange={(value) =>
                    setIsPublished(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tDashboard("status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tDashboard("allStatus")}</SelectItem>
                    <SelectItem value="true">{tDashboard("published")}</SelectItem>
                    <SelectItem value="false">{tDashboard("draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{tDashboard("statusTooltip") || "Filter by publication status"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch(null);
                    setTechStack(null);
                    setIsPublished(null);
                    setPage(1);
                  }}
                  className="w-full sm:w-auto"
                  disabled={!search && !techStack && !isPublished}
                >
                  <X className="h-4 w-4 mr-2" />
                  {tDashboard("clearFilters")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{tDashboard("clearFiltersTooltip") || "Reset all filters"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {error ? (
            <div className="text-center py-8 text-destructive">
              Error loading projects: {error.message}
            </div>
          ) : !mounted ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <ProjectsDataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              pageCount={data?.meta?.totalPages || 1}
              totalCount={data?.meta?.total || 0}
              currentPage={page}
              pageSize={limit}
              onPaginationChange={(newPage) => {
                setPage(newPage);
              }}
              translations={{
                noResults: tTable("noResults") as string,
                showing: tTable("showing", {
                  from: String((page - 1) * limit + 1),
                  to: String(Math.min(page * limit, data?.meta?.total || 0)),
                  total: String(data?.meta?.total || 0),
                }) as string,
                page: tTable("page", {
                  current: String(page),
                  total: String(data?.meta?.totalPages || 1),
                }) as string,
                firstPage: tTable("firstPage") as string,
                previousPage: tTable("previousPage") as string,
                nextPage: tTable("nextPage") as string,
                lastPage: tTable("lastPage") as string,
              }}
            />
          )}
        </CardContent>
      </Card>

      <ProjectFormSheet
        project={fullProjectData || selectedProject || undefined}
        open={formDialogOpen}
        onOpenChange={(open) => {
          setFormDialogOpen(open);
          if (!open) {
            setSelectedProjectId(null);
            setSelectedProject(null);
          }
        }}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteProjectDialog
        project={selectedProject}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      <ProjectPreviewDialog
        projectId={previewProjectId}
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      />
      </div>
    </TooltipProvider>
  );
}
