"use client";

import * as React from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "./use-project-mutations";
import { useProject } from "./use-project-queries";
import { getProjectChanges } from "../utils/diff";
import type { Project } from "@/types";
import type { ProjectFormValues } from "../utils/schema";

interface UseProjectsMutationsHandlerOptions {
  selectedProject: Project | null;
  selectedProjectId: string | null;
  onFormDialogClose: () => void;
  onDeleteDialogClose: () => void;
  onResetSelection: () => void;
}

interface UseProjectsMutationsHandlerReturn {
  createMutation: ReturnType<typeof useCreateProjectMutation>;
  updateMutation: ReturnType<typeof useUpdateProjectMutation>;
  deleteMutation: ReturnType<typeof useDeleteProjectMutation>;
  fullProjectData: Project | undefined;
  handleFormSubmit: (formData: ProjectFormValues) => void;
  handleDeleteConfirm: () => void;
  isFormLoading: boolean;
}

export function useProjectsMutationsHandler({
  selectedProject,
  selectedProjectId,
  onFormDialogClose,
  onDeleteDialogClose,
  onResetSelection,
}: UseProjectsMutationsHandlerOptions): UseProjectsMutationsHandlerReturn {
  const { data: fullProjectData } = useProject(selectedProjectId);
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();

  // Close form dialog on successful mutations
  React.useEffect(() => {
    if (
      createMutation.isSuccess &&
      createMutation.data?.success === true
    ) {
      onFormDialogClose();
      onResetSelection();
    }
  }, [createMutation.isSuccess, createMutation.data, onFormDialogClose, onResetSelection]);

  React.useEffect(() => {
    if (
      updateMutation.isSuccess &&
      updateMutation.data?.success === true
    ) {
      onFormDialogClose();
      onResetSelection();
    }
  }, [updateMutation.isSuccess, updateMutation.data, onFormDialogClose, onResetSelection]);

  const handleFormSubmit = React.useCallback(
    (formData: ProjectFormValues) => {
      if (selectedProject) {
        const originalProject = fullProjectData || selectedProject;
        const changes = getProjectChanges(originalProject, formData);
        updateMutation.mutate({
          id: selectedProject.id,
          data: changes,
        });
      } else {
        createMutation.mutate(formData);
      }
    },
    [selectedProject, fullProjectData, createMutation, updateMutation]
  );

  const handleDeleteConfirm = React.useCallback(() => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
      onDeleteDialogClose();
      onResetSelection();
    }
  }, [selectedProject, deleteMutation, onDeleteDialogClose, onResetSelection]);

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    fullProjectData,
    handleFormSubmit,
    handleDeleteConfirm,
    isFormLoading: createMutation.isPending || updateMutation.isPending,
  };
}

