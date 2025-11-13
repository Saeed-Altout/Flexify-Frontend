"use server";

import { getLocale } from "next-intl/server";
import { SESSION_TOKEN_COOKIE_NAME } from "@/constants/auth.constants";
import type {
  ServerActionResult,
  ApiResponse,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectsDto,
  ProjectsListResponse,
} from "@/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/**
 * Get the current locale and return it as Accept-Language header value
 */
async function getAcceptLanguageHeader(): Promise<string> {
  try {
    const locale = await getLocale();
    return locale;
  } catch {
    return "en";
  }
}

/**
 * Get session token from cookies
 */
async function getSessionToken(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_TOKEN_COOKIE_NAME)?.value || null;
}

export async function getProjects(
  query?: QueryProjectsDto
): Promise<ServerActionResult<ProjectsListResponse>> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const params = new URLSearchParams();

    if (query?.search) params.append("search", query.search);
    if (query?.tech_stack) params.append("tech_stack", query.tech_stack);
    if (query?.is_published !== undefined)
      params.append("is_published", String(query.is_published));
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.sort_by) params.append("sort_by", query.sort_by);
    if (query?.order) params.append("order", query.order);

    const response = await fetch(
      `${BACKEND_URL}/api/projects?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": acceptLanguage,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to fetch projects",
      };
    }

    const result = (await response.json()) as ApiResponse<ProjectsListResponse>;
    if (!result.data) {
      return {
        success: false,
        error: "No data received",
      };
    }
    return { success: true, data: result.data };
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
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Project not found",
      };
    }

    const result = (await response.json()) as ApiResponse<Project>;
    if (!result.data) {
      return {
        success: false,
        error: "Project not found",
      };
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ServerActionResult<Project>> {
  try {
    const acceptLanguage = await getAcceptLanguageHeader();
    const response = await fetch(`${BACKEND_URL}/api/projects/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Project not found",
      };
    }

    const result = (await response.json()) as ApiResponse<Project>;
    if (!result.data) {
      return {
        success: false,
        error: "Project not found",
      };
    }
    return { success: true, data: result.data };
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
    const acceptLanguage = await getAcceptLanguageHeader();
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to create project",
      };
    }

    const result = (await response.json()) as ApiResponse<Project>;
    if (!result.data) {
      return {
        success: false,
        error: "Failed to create project",
      };
    }
    return { success: true, data: result.data };
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
    const acceptLanguage = await getAcceptLanguageHeader();
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to update project",
      };
    }

    const result = (await response.json()) as ApiResponse<Project>;
    if (!result.data) {
      return {
        success: false,
        error: "Failed to update project",
      };
    }
    return { success: true, data: result.data };
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
    const acceptLanguage = await getAcceptLanguageHeader();
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to delete project",
      };
    }

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
    const acceptLanguage = await getAcceptLanguageHeader();
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to rate project",
      };
    }

    const result = (await response.json()) as ApiResponse<{ rating: number }>;
    if (!result.data) {
      return {
        success: false,
        error: "Failed to rate project",
      };
    }
    return { success: true, data: result.data };
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
    const acceptLanguage = await getAcceptLanguageHeader();
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiResponse<null>;
      return {
        success: false,
        error: error.message || "Failed to like project",
      };
    }

    const result = (await response.json()) as ApiResponse<{ liked: boolean }>;
    if (!result.data) {
      return {
        success: false,
        error: "Failed to like project",
      };
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
