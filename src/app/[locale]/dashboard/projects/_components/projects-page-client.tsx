"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaHeader,
  AreaTable,
  AreaTitle,
  AreaPagination,
  AreaFooter,
  AreaToolbar,
  AreaDescription,
  AreaActions,
} from "@/components/ui/area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";

import type { Project } from "@/types";
import { SearchIcon, SortAscIcon, SortDescIcon, PlusIcon } from "lucide-react";

import { ProjectsProvider } from "@/app/[locale]/dashboard/projects/_components/projects-context";
import { useProjectsTable } from "@/modules/projects/hooks/use-projects-table";
import { createProjectsColumns } from "@/app/[locale]/dashboard/projects/_components/projects-table-columns";
import { CreateProjectModal } from "@/app/[locale]/dashboard/projects/[projectId]/new/create-project-modal";
import { EditProjectModal } from "@/app/[locale]/dashboard/projects/[projectId]/edit/_components/update-project-page-client";
import { DeleteProjectModal } from "@/app/[locale]/dashboard/projects/_components/delete-project-modal";
import { PreviewProjectModal } from "@/app/[locale]/dashboard/projects/[projectId]/(view)/_components/preview-project-page-client";

function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const {
    projects,
    meta,
    isLoading,
    error,
    queryParams,
    setPage,
    setSearch,
    setSort,
    setFilter,
    clearFilters,
  } = useProjectsTable();

  const [searchValue, setSearchValue] = React.useState(
    queryParams.search || ""
  );

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, setSearch]);

  // Handle project actions
  const handlePreview = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setIsPreviewOpen(true);
  }, []);

  const handleDelete = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseModals = React.useCallback(() => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsPreviewOpen(false);
    setSelectedProject(null);
  }, []);

  // Create columns with handlers
  const columns = React.useMemo(
    () =>
      createProjectsColumns({
        onPreview: handlePreview,
        onDelete: handleDelete,
      }),
    [handlePreview, handleDelete]
  );

  // Pagination helpers
  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;
  const limit = queryParams.limit ?? 10;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const hasActiveFilters =
    queryParams.search ||
    queryParams.tech_stack ||
    queryParams.is_published !== undefined;

  return (
    <>
      <Area>
        <AreaHeader>
          <div className="flex items-start justify-between">
            <div>
              <AreaTitle>Projects</AreaTitle>
              <AreaDescription>
                Manage projects in your organization
              </AreaDescription>
            </div>
          </div>
        </AreaHeader>

        <AreaToolbar>
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Search projects..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
          <ButtonGroup>
            {hasActiveFilters && (
              <Button variant="destructive" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
            <Select
              value={queryParams.is_published?.toString() || "all"}
              onValueChange={(value) =>
                setFilter(
                  "is_published",
                  value === "all" ? undefined : value === "true"
                )
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
            <AreaActions asChild>
              <CreateProjectModal>
                <Button variant="outline" size="icon">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">New Project</span>
                </Button>
              </CreateProjectModal>
            </AreaActions>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSort(
                  queryParams.sort_by || "created_at",
                  queryParams.order === "ASC" ? "DESC" : "ASC"
                )
              }
            >
              {queryParams.order === "ASC" ? (
                <SortAscIcon className="h-4 w-4" />
              ) : (
                <SortDescIcon className="h-4 w-4" />
              )}
            </Button>
          </ButtonGroup>
        </AreaToolbar>

        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
            Error loading projects: {error.message}
          </div>
        )}

        {isLoading && !projects.length ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <AreaTable columns={columns} data={projects} />
        )}

        {meta && total > 0 && (
          <AreaPagination>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, total)} of {total} projects
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </AreaPagination>
        )}

        <AreaFooter>
          <p className="text-sm text-muted-foreground">
            {total === 0
              ? "No projects found. Create your first project to get started."
              : `Total: ${total} project${total !== 1 ? "s" : ""}`}
          </p>
        </AreaFooter>
      </Area>

      {/* Modals */}

      {selectedProject && (
        <>
          <DeleteProjectModal
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            project={selectedProject}
            onSuccess={handleCloseModals}
          />
          <PreviewProjectModal
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            project={selectedProject}
          />
        </>
      )}
    </>
  );
}

export function ProjectsPageClient() {
  return (
    <ProjectsProvider>
      <ProjectsPageContent />
    </ProjectsProvider>
  );
}
