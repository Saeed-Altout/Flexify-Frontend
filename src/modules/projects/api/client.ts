/**
 * Standardized API client for projects
 * Handles all HTTP requests with proper error handling and type safety
 */

import {
  apiFetch,
  authenticatedFetch,
  buildQueryString,
} from "@/core/api/client";
import type {
  ApiResponse,
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectsDto,
  Project,
  ProjectsListResponse,
} from "@/types";

/**
 * Projects API Client
 */
export const projectsApi = {
  /**
   * Get list of projects
   */
  async getList(query?: QueryProjectsDto): Promise<ProjectsListResponse> {
    const queryString = query ? `?${buildQueryString(query)}` : "";
    const result = await apiFetch<ProjectsListResponse>(`/api/projects${queryString}`);
    
    if (!result.data) {
      throw new Error("No data received");
    }
    
    return result.data;
  },

  /**
   * Get single project by ID
   */
  async getById(id: string): Promise<Project> {
    const result = await apiFetch<Project>(`/api/projects/${id}`);
    
    if (!result.data) {
      throw new Error("Project not found");
    }
    
    return result.data;
  },

  /**
   * Create new project
   */
  async create(data: CreateProjectDto): Promise<Project> {
    const result = await authenticatedFetch<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (!result.data) {
      throw new Error("Failed to create project");
    }
    
    return result.data;
  },

  /**
   * Update project
   */
  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const result = await authenticatedFetch<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    
    if (!result.data) {
      throw new Error("Failed to update project");
    }
    
    return result.data;
  },

  /**
   * Delete project
   */
  async delete(id: string): Promise<void> {
    await authenticatedFetch<null>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Rate project
   */
  async rate(id: string, rating: number): Promise<{ rating: number }> {
    const result = await authenticatedFetch<{ rating: number }>(`/api/projects/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
    
    if (!result.data) {
      throw new Error("Failed to rate project");
    }
    
    return result.data;
  },

  /**
   * Like/Unlike project
   */
  async like(id: string): Promise<{ liked: boolean }> {
    const result = await authenticatedFetch<{ liked: boolean }>(`/api/projects/${id}/like`, {
      method: "POST",
    });
    
    if (!result.data) {
      throw new Error("Failed to like project");
    }
    
    return result.data;
  },
};

