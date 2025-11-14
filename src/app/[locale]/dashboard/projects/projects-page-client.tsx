"use client";

import * as React from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useProjects, useProject } from "@/hooks/use-project-queries";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/hooks/use-project-mutations";
import { DataTable } from "@/components/projects/data-table";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, ExternalLink, Eye } from "lucide-react";
import type { Project } from "@/types";
import type { ProjectFormValues } from "@/utils/projects/project-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, truncate } from "@/utils/projects/format-utils";
import { getProjectChanges } from "@/utils/projects/diff-utils";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export function ProjectsPageClient() {
  const t = useTranslations("auth.projects");
  const tDashboard = useTranslations("auth.projects.dashboard");
  const tTable = useTranslations("auth.projects.dashboard.table");
  const locale = useLocale();
  const [mounted, setMounted] = React.useState(false);

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [techStack, setTechStack] = useQueryState("tech_stack", parseAsString);
  const [isPublished, setIsPublished] = useQueryState(
    "is_published",
    parseAsString
  );

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    null
  );
  const [previewProjectId, setPreviewProjectId] = React.useState<string | null>(
    null
  );

  // Fetch full project data with translations when editing
  const { data: fullProjectData } = useProject(selectedProjectId);

  // Ensure component is mounted before rendering to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useProjects({
    search: search || undefined,
    tech_stack: techStack || undefined,
    is_published:
      isPublished === "true"
        ? true
        : isPublished === "false"
        ? false
        : undefined,
    page,
    limit,
    sort_by: "created_at",
    order: "DESC",
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

  const columns: ColumnDef<Project>[] = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: tTable("title"),
        cell: ({ row }) => {
          const project = row.original;
          const translation = project.translations?.find((t) => t.language === locale);
          const projectTitle = translation?.title || project.translations?.[0]?.title || "Untitled";
          const projectSummary = translation?.summary || project.translations?.[0]?.summary || "";
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {truncate(projectTitle, 40)}
              </span>
              <span className="text-xs text-muted-foreground">
                {truncate(projectSummary, 50)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "tech_stack",
        header: tTable("techStack"),
        cell: ({ row }) => {
          const techStack = row.original.tech_stack;
          return (
            <div className="flex flex-wrap gap-1">
              {techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {techStack.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{techStack.length - 3}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: tTable("role"),
        cell: ({ row }) => row.original.role,
      },
      {
        accessorKey: "average_rating",
        header: tTable("rating"),
        cell: ({ row }) => {
          const rating = row.original.average_rating;
          return rating > 0 ? rating.toFixed(1) : "N/A";
        },
      },
      {
        accessorKey: "total_likes",
        header: tTable("likes"),
        cell: ({ row }) => row.original.total_likes,
      },
      {
        accessorKey: "is_published",
        header: tTable("status"),
        cell: ({ row }) => {
          const isPublished = row.original.is_published;
          return (
            <Badge variant={isPublished ? "default" : "outline"}>
              {isPublished ? tDashboard("published") : tDashboard("draft")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: tTable("created"),
        cell: ({ row }) => {
          // Use client-only date formatting to prevent hydration mismatch
          if (!mounted) return "—";
          return formatDate(row.original.created_at);
        },
      },
      {
        id: "actions",
        header: tTable("actions"),
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handlePreview(project)}
                title={tDashboard("previewButton")}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {project.live_demo_url && (
                <Link
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon-sm" title={tDashboard("viewLive")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleEdit(project)}
                title={tDashboard("edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(project)}
                title={tDashboard("delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [tTable, tDashboard, mounted, handlePreview, handleEdit, handleDelete]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {tDashboard("newProject")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tDashboard("filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tDashboard("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value || null)}
                className="pl-9"
              />
            </div>
            <Input
              placeholder={tDashboard("techStackPlaceholder")}
              value={techStack || ""}
              onChange={(e) => setTechStack(e.target.value || null)}
            />
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
            <Button
              variant="outline"
              onClick={() => {
                setSearch(null);
                setTechStack(null);
                setIsPublished(null);
                setPage(1);
              }}
            >
              {tDashboard("clearFilters")}
            </Button>
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
            <DataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              pageCount={data?.meta?.totalPages || 1}
              onPaginationChange={(newPage) => {
                setPage(newPage);
              }}
              translations={{
                noResults: tTable("noResults") as string,
                showing: tTable("showing", {
                  from: "",
                  to: "",
                  total: "",
                }) as string,
                page: tTable("page", { current: "", total: "" }) as string,
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
  );
}
