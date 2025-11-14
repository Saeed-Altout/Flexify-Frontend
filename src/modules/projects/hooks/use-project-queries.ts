"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProjects, getProject } from "../api/actions";
import type { QueryProjectsDto, Project, ProjectsListResponse } from "@/types";

/**
 * Query hook to fetch list of projects
 */
export function useProjects(query?: QueryProjectsDto) {
  return useQuery<ProjectsListResponse, Error>({
    queryKey: ["projects", query],
    queryFn: async () => {
      const result = await getProjects(query);
      if (!result.success) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("No data received");
      }
      return result.data;
    },
    placeholderData: keepPreviousData,
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
      if (!result.success) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("Project not found");
      }
      return result.data;
    },
    placeholderData: keepPreviousData,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
