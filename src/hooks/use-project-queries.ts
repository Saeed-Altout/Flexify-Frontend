"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, getProject, getProjectBySlug } from "@/lib/projects/actions";
import type {
  QueryProjectsDto,
  Project,
  ProjectsListResponse,
} from "@/types";

/**
 * Query hook to fetch list of projects
 */
export function useProjects(query?: QueryProjectsDto) {
  return useQuery<ProjectsListResponse, Error>({
    queryKey: ["projects", query],
    queryFn: async () => {
      const result = await getProjects(query);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("No data received");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query hook to fetch a single project by ID
 */
export function useProject(id: string | null | undefined) {
  return useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Project ID is required");
      }
      const result = await getProject(id);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("Project not found");
      }
      return result.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query hook to fetch a single project by slug
 */
export function useProjectBySlug(slug: string | null | undefined) {
  return useQuery<Project, Error>({
    queryKey: ["project", "slug", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Project slug is required");
      }
      const result = await getProjectBySlug(slug);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("Project not found");
      }
      return result.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

