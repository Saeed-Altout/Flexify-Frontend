"use client";

import * as React from "react";
import { useProjectsDashboardState } from "../hooks/use-projects-dashboard-state";
import { useProjectsMutationsHandler } from "../hooks/use-projects-mutations-handler";
import type { Project } from "@/types";
import type { ProjectFormValues } from "../utils/schema";

interface ProjectsDashboardContextValue {
  // State
  mounted: boolean;
  formDialogOpen: boolean;
  deleteDialogOpen: boolean;
  previewDialogOpen: boolean;
  selectedProject: Project | null;
  selectedProjectId: string | null;
  previewProjectId: string | null;
  fullProjectData: Project | undefined;
  isFormLoading: boolean;
  isDeleteLoading: boolean;

  // Actions
  setFormDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setPreviewDialogOpen: (open: boolean) => void;
  handleCreate: () => void;
  handleEdit: (project: Project) => void;
  handleDelete: (project: Project) => void;
  handlePreview: (project: Project) => void;
  handleFormSubmit: (data: ProjectFormValues) => void;
  handleDeleteConfirm: () => void;
  resetSelection: () => void;
}

const ProjectsDashboardContext = React.createContext<
  ProjectsDashboardContextValue | undefined
>(undefined);

interface ProjectsDashboardProviderProps {
  children: React.ReactNode;
}

export function ProjectsDashboardProvider({
  children,
}: ProjectsDashboardProviderProps) {
  const dashboardState = useProjectsDashboardState();

  const mutationsHandler = useProjectsMutationsHandler({
    selectedProject: dashboardState.selectedProject,
    selectedProjectId: dashboardState.selectedProjectId,
    onFormDialogClose: () => dashboardState.setFormDialogOpen(false),
    onDeleteDialogClose: () => dashboardState.setDeleteDialogOpen(false),
    onResetSelection: dashboardState.resetSelection,
  });

  const value: ProjectsDashboardContextValue = React.useMemo(
    () => ({
      mounted: dashboardState.mounted,
      formDialogOpen: dashboardState.formDialogOpen,
      deleteDialogOpen: dashboardState.deleteDialogOpen,
      previewDialogOpen: dashboardState.previewDialogOpen,
      selectedProject: dashboardState.selectedProject,
      selectedProjectId: dashboardState.selectedProjectId,
      previewProjectId: dashboardState.previewProjectId,
      fullProjectData: mutationsHandler.fullProjectData,
      isFormLoading: mutationsHandler.isFormLoading,
      isDeleteLoading: mutationsHandler.deleteMutation.isPending,
      setFormDialogOpen: dashboardState.setFormDialogOpen,
      setDeleteDialogOpen: dashboardState.setDeleteDialogOpen,
      setPreviewDialogOpen: dashboardState.setPreviewDialogOpen,
      handleCreate: dashboardState.handleCreate,
      handleEdit: dashboardState.handleEdit,
      handleDelete: dashboardState.handleDelete,
      handlePreview: dashboardState.handlePreview,
      handleFormSubmit: mutationsHandler.handleFormSubmit,
      handleDeleteConfirm: mutationsHandler.handleDeleteConfirm,
      resetSelection: dashboardState.resetSelection,
    }),
    [dashboardState, mutationsHandler]
  );

  return (
    <ProjectsDashboardContext.Provider value={value}>
      {children}
    </ProjectsDashboardContext.Provider>
  );
}

export function useProjectsDashboard() {
  const context = React.useContext(ProjectsDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useProjectsDashboard must be used within a ProjectsDashboardProvider"
    );
  }
  return context;
}

