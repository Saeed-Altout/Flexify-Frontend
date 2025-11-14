"use client";

import * as React from "react";
import type { Project } from "@/types";

interface UseProjectsDashboardStateReturn {
  mounted: boolean;
  formDialogOpen: boolean;
  setFormDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  previewDialogOpen: boolean;
  setPreviewDialogOpen: (open: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  previewProjectId: string | null;
  setPreviewProjectId: (id: string | null) => void;
  handleCreate: () => void;
  handleEdit: (project: Project) => void;
  handleDelete: (project: Project) => void;
  handlePreview: (project: Project) => void;
  resetSelection: () => void;
}

export function useProjectsDashboardState(): UseProjectsDashboardStateReturn {
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreate = React.useCallback(() => {
    setSelectedProject(null);
    setSelectedProjectId(null);
    setFormDialogOpen(true);
  }, []);

  const handleEdit = React.useCallback((project: Project) => {
    setSelectedProjectId(project.id);
    setSelectedProject(project);
    setFormDialogOpen(true);
  }, []);

  const handleDelete = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  }, []);

  const handlePreview = React.useCallback((project: Project) => {
    setPreviewProjectId(project.id);
    setPreviewDialogOpen(true);
  }, []);

  const resetSelection = React.useCallback(() => {
    setSelectedProject(null);
    setSelectedProjectId(null);
  }, []);

  return {
    mounted,
    formDialogOpen,
    setFormDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    previewDialogOpen,
    setPreviewDialogOpen,
    selectedProject,
    setSelectedProject,
    selectedProjectId,
    setSelectedProjectId,
    previewProjectId,
    setPreviewProjectId,
    handleCreate,
    handleEdit,
    handleDelete,
    handlePreview,
    resetSelection,
  };
}
