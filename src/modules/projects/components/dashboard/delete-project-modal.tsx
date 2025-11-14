"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProjectMutation } from "@/modules/projects/hooks/use-project-mutations";
import type { Project } from "@/types";

interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess?: () => void;
}

export function DeleteProjectModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: DeleteProjectModalProps) {
  const deleteMutation = useDeleteProjectMutation();

  const handleDelete = React.useCallback(() => {
    deleteMutation.mutate(project.id, {
      onSuccess: (result) => {
        if (result.success) {
          onOpenChange(false);
          onSuccess?.();
        }
      },
    });
  }, [project.id, deleteMutation, onOpenChange, onSuccess]);

  const translation = project.translations?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you absolutely sure? This action cannot be undone. This will
            permanently delete the project{" "}
            <strong>{translation?.title || "Untitled"}</strong> and remove all
            associated data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
