"use client";

import { useProjectsDashboard } from "../../context/projects-dashboard-context";
import { ProjectFormSheet } from "../project-form-sheet";
import { DeleteProjectDialog } from "../delete-project-dialog";
import { ProjectPreviewDialog } from "../project-preview-dialog";

export function ProjectsDialogs() {
  const {
    formDialogOpen,
    setFormDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    previewDialogOpen,
    setPreviewDialogOpen,
    selectedProject,
    fullProjectData,
    previewProjectId,
    handleFormSubmit,
    handleDeleteConfirm,
    isFormLoading,
    isDeleteLoading,
    resetSelection,
  } = useProjectsDashboard();

  const handleFormDialogChange = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) {
      resetSelection();
    }
  };

  return (
    <>
      <ProjectFormSheet
        project={fullProjectData || selectedProject || undefined}
        open={formDialogOpen}
        onOpenChange={handleFormDialogChange}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      <DeleteProjectDialog
        project={selectedProject}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleteLoading}
      />

      <ProjectPreviewDialog
        projectId={previewProjectId}
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      />
    </>
  );
}
