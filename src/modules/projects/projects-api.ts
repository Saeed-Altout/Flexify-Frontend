import { apiClient } from "@/lib/axios";
import {
  ICreateProjectRequest,
  IUpdateProjectRequest,
  IQueryProjectParams,
  ICreateCommentRequest,
  ICreateInteractionRequest,
  IUploadProjectImageRequest,
  IProjectResponse,
  IProjectsResponse,
  IProjectDetailResponse,
  ITechnologiesResponse,
  ICategoriesResponse,
  IProjectCommentsResponse,
  IUploadImageResponse,
  IInteractionResponse,
} from "@/modules/projects/projects-type";

// ========================================
// PROJECTS
// ========================================

export const getProjects = async (
  params?: IQueryProjectParams
): Promise<IProjectsResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<IProjectsResponse>("/projects", {
    params: queryParams,
  });
  return response.data;
};

export const getProjectById = async (id: string): Promise<IProjectResponse> => {
  const response = await apiClient.get<IProjectResponse>(`/projects/${id}`);
  return response.data;
};

export const getProjectBySlug = async (
  slug: string
): Promise<IProjectDetailResponse> => {
  const response = await apiClient.get<IProjectDetailResponse>(
    `/projects/slug/${slug}`
  );
  return response.data;
};

export const createProject = async (
  data: ICreateProjectRequest
): Promise<IProjectResponse> => {
  const response = await apiClient.post<IProjectResponse>("/projects", data);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: IUpdateProjectRequest
): Promise<IProjectResponse> => {
  const response = await apiClient.patch<IProjectResponse>(
    `/projects/${id}`,
    data
  );
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

// ========================================
// PROJECT THUMBNAIL
// ========================================

export const uploadProjectThumbnail = async (
  projectId: string,
  file: File
): Promise<IUploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<IUploadImageResponse>(
    `/projects/${projectId}/thumbnail`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// ========================================
// PROJECT IMAGES
// ========================================

export const uploadProjectImage = async (
  projectId: string,
  file: File,
  data?: IUploadProjectImageRequest
): Promise<IUploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (data?.altText) formData.append("altText", data.altText);
  if (data?.orderIndex !== undefined)
    formData.append("orderIndex", data.orderIndex.toString());
  if (data?.isPrimary !== undefined)
    formData.append("isPrimary", data.isPrimary.toString());

  const response = await apiClient.post<IUploadImageResponse>(
    `/projects/${projectId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteProjectImage = async (imageId: string): Promise<void> => {
  await apiClient.delete(`/projects/images/${imageId}`);
};

// ========================================
// INTERACTIONS (Like/Share)
// ========================================

export const toggleInteraction = async (
  data: ICreateInteractionRequest
): Promise<IInteractionResponse> => {
  const response = await apiClient.post<IInteractionResponse>(
    "/projects/interactions",
    data
  );
  return response.data;
};

// ========================================
// COMMENTS
// ========================================

export const getProjectComments = async (
  projectId: string
): Promise<IProjectCommentsResponse> => {
  const response = await apiClient.get<IProjectCommentsResponse>(
    `/projects/${projectId}/comments`
  );
  return response.data;
};

export const createComment = async (
  data: ICreateCommentRequest
): Promise<IProjectResponse> => {
  const response = await apiClient.post<IProjectResponse>(
    "/projects/comments",
    data
  );
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/projects/comments/${commentId}`);
};

// ========================================
// TECHNOLOGIES
// ========================================

export const getTechnologies = async (): Promise<ITechnologiesResponse> => {
  const response =
    await apiClient.get<ITechnologiesResponse>("/technologies");
  return response.data;
};

export const getTechnologiesByCategory = async (
  category: string
): Promise<ITechnologiesResponse> => {
  const response = await apiClient.get<ITechnologiesResponse>(
    `/technologies/category/${category}`
  );
  return response.data;
};

// ========================================
// CATEGORIES
// ========================================

export const getCategories = async (): Promise<ICategoriesResponse> => {
  const response = await apiClient.get<ICategoriesResponse>("/categories");
  return response.data;
};

