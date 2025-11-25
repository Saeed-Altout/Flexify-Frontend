import { AxiosError } from "axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectThumbnail,
  uploadProjectImage,
  deleteProjectImage,
  toggleInteraction,
  getProjectComments,
  createComment,
  deleteComment,
  incrementView,
  getTechnologies,
  getTechnologiesByCategory,
  getCategories,
} from "@/modules/projects/projects-api";
import type {
  ICreateProjectRequest,
  IUpdateProjectRequest,
  IQueryProjectParams,
  ICreateCommentRequest,
  ICreateInteractionRequest,
  IUploadProjectImageRequest,
} from "@/modules/projects/projects-type";

// ========================================
// PROJECTS QUERIES
// ========================================

export const useProjectsQuery = (params?: IQueryProjectParams) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useProjectQuery = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ========================================
// PROJECTS MUTATIONS
// ========================================

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: (data: ICreateProjectRequest) => createProject(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(response.message || t("createSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("createError"));
      }
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["updateProject"],
    mutationFn: ({ id, data }: { id: string; data: IUpdateProjectRequest }) =>
      updateProject(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.id],
      });
      toast.success(response.message || t("updateSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("updateError"));
      }
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["deleteProject"],
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("deleteError"));
      }
    },
  });
};

// ========================================
// PROJECT THUMBNAIL MUTATION
// ========================================

export const useUploadProjectThumbnailMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["uploadProjectThumbnail"],
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      uploadProjectThumbnail(projectId, file),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(response.message || t("thumbnailUploadSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("thumbnailUploadError"));
      }
    },
  });
};

// ========================================
// PROJECT IMAGES MUTATIONS
// ========================================

export const useUploadProjectImageMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["uploadProjectImage"],
    mutationFn: ({
      projectId,
      file,
      data,
    }: {
      projectId: string;
      file: File;
      data?: IUploadProjectImageRequest;
    }) => uploadProjectImage(projectId, file, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      toast.success(response.message || t("imageUploadSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("imageUploadError"));
      }
    },
  });
};

export const useDeleteProjectImageMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["deleteProjectImage"],
    mutationFn: (imageId: string) => deleteProjectImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("imageDeleteSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("imageDeleteError"));
      }
    },
  });
};

// ========================================
// INTERACTIONS MUTATIONS
// ========================================

export const useToggleInteractionMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["toggleInteraction"],
    mutationFn: (data: ICreateInteractionRequest) => toggleInteraction(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "slug"],
      });
      const action = response.data.data.action;
      const type = variables.interactionType;
      const message =
        action === "added"
          ? type === "like"
            ? t("likeAdded")
            : t("shareAdded")
          : type === "like"
            ? t("likeRemoved")
            : t("shareRemoved");
      toast.success(message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("interactionError"));
      }
    },
  });
};

export const useIncrementViewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["incrementView"],
    mutationFn: (projectId: string) => incrementView(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "slug"],
      });
    },
  });
};

// ========================================
// COMMENTS QUERIES & MUTATIONS
// ========================================

export const useProjectCommentsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "comments"],
    queryFn: () => getProjectComments(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["createComment"],
    mutationFn: (data: ICreateCommentRequest) => createComment(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "comments"],
      });
      toast.success(response.message || t("commentCreateSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("commentCreateError"));
      }
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.projects.message");

  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("commentDeleteSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("commentDeleteError"));
      }
    },
  });
};

// ========================================
// TECHNOLOGIES QUERIES
// ========================================

export const useTechnologiesQuery = () => {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: () => getTechnologies(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTechnologiesByCategoryQuery = (category: string) => {
  return useQuery({
    queryKey: ["technologies", "category", category],
    queryFn: () => getTechnologiesByCategory(category),
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
};

// ========================================
// CATEGORIES QUERIES
// ========================================

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

