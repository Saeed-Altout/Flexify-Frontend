"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  createProject,
  updateProject,
  deleteProject,
  rateProject,
  likeProject,
} from "@/lib/projects/actions";
import type {
  CreateProjectDto,
  UpdateProjectDto,
  Project,
  MutationResult,
} from "@/types";

export function useCreateProjectMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.messages");
  const tProjects = useTranslations("auth.projects");

  return useMutation<MutationResult<Project>, Error, CreateProjectDto>({
    mutationFn: async (data: CreateProjectDto) => {
      return await createProject(data);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("errorOccurred"));
      } else {
        toast.success(tProjects("createSuccess"));
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push("/projects");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errorOccurred"));
    },
  });
}

export function useUpdateProjectMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.messages");
  const tProjects = useTranslations("auth.projects");

  return useMutation<
    MutationResult<Project>,
    Error,
    { id: string; data: UpdateProjectDto }
  >({
    mutationFn: async ({ id, data }) => {
      return await updateProject(id, data);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("errorOccurred"));
      } else {
        toast.success(tProjects("updateSuccess"));
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["project"] });
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errorOccurred"));
    },
  });
}

export function useDeleteProjectMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth.messages");
  const tProjects = useTranslations("auth.projects");

  return useMutation<MutationResult<null>, Error, string>({
    mutationFn: async (id: string) => {
      return await deleteProject(id);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("errorOccurred"));
      } else {
        toast.success(tProjects("deleteSuccess"));
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push("/projects");
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errorOccurred"));
    },
  });
}

export function useRateProjectMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("auth.messages");
  const tProjects = useTranslations("auth.projects");

  return useMutation<
    MutationResult<{ rating: number }>,
    Error,
    { id: string; rating: number }
  >({
    mutationFn: async ({ id, rating }) => {
      return await rateProject(id, rating);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("errorOccurred"));
      } else {
        toast.success(tProjects("rateSuccess"));
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["project"] });
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errorOccurred"));
    },
  });
}

export function useLikeProjectMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("auth.messages");
  const tProjects = useTranslations("auth.projects");

  return useMutation<MutationResult<{ liked: boolean }>, Error, string>({
    mutationFn: async (id: string) => {
      return await likeProject(id);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error || t("errorOccurred"));
      } else {
        const message = result.data?.liked
          ? tProjects("likeSuccess")
          : tProjects("unlikeSuccess");
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["project"] });
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errorOccurred"));
    },
  });
}
