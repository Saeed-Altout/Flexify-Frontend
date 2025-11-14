"use server";

import { projectsApi } from "./client";
import type {
  ServerActionResult,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectsDto,
  ProjectsListResponse,
} from "@/types";

/**
 * Server actions for projects
 * Wraps API client with ServerActionResult for better error handling
 */

export async function getProjects(
  query?: QueryProjectsDto
): Promise<ServerActionResult<ProjectsListResponse>> {
  try {
    const data = await projectsApi.getList(query);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function getProject(
  id: string
): Promise<ServerActionResult<Project>> {
  try {
    const data = await projectsApi.getById(id);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function createProject(
  data: CreateProjectDto
): Promise<ServerActionResult<Project>> {
  try {
    const result = await projectsApi.create(data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updateProject(
  id: string,
  data: UpdateProjectDto
): Promise<ServerActionResult<Project>> {
  try {
    const result = await projectsApi.update(id, data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteProject(
  id: string
): Promise<ServerActionResult<null>> {
  try {
    await projectsApi.delete(id);
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function rateProject(
  id: string,
  rating: number
): Promise<ServerActionResult<{ rating: number }>> {
  try {
    const result = await projectsApi.rate(id, rating);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function likeProject(
  id: string
): Promise<ServerActionResult<{ liked: boolean }>> {
  try {
    const result = await projectsApi.like(id);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

