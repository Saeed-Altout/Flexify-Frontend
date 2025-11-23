import { apiClient } from "@/lib/axios";
import {
  ICreateTechnologyRequest,
  IUpdateTechnologyRequest,
  IQueryTechnologyParams,
  ITechnologyResponse,
  ITechnologiesResponse,
  ITechnologiesListResponse,
} from "./technologies-type";

export const getTechnologies = async (
  params?: IQueryTechnologyParams
): Promise<ITechnologiesResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  // Server returns: { status, message, data: { data: { technologies: ITechnology[] } } }
  const response = await apiClient.get<ITechnologiesListResponse>(
    "/technologies",
    {
      params: queryParams,
    }
  );

  // Transform the response to match expected format
  // Response structure: response.data.data.data.technologies
  const technologies = response.data.data?.data?.technologies || [];

  // Apply client-side filtering if needed (since server doesn't support pagination yet)
  let filtered = technologies;
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = technologies.filter(
      (tech) =>
        tech.name.toLowerCase().includes(searchLower) ||
        tech.description?.toLowerCase().includes(searchLower) ||
        tech.slug.toLowerCase().includes(searchLower) ||
        tech.category?.toLowerCase().includes(searchLower)
    );
  }
  if (params?.category) {
    filtered = filtered.filter((tech) => tech.category === params.category);
  }

  // Apply pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    ...response.data,
    data: {
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
    },
  } as ITechnologiesResponse;
};

export const getTechnologyById = async (
  id: string
): Promise<ITechnologyResponse> => {
  const response = await apiClient.get<ITechnologyResponse>(
    `/technologies/${id}`
  );
  // Response structure: { status, message, data: { data: ITechnology } }
  // Return the full response as it already matches ITechnologyResponse structure
  return response.data;
};

export const getTechnologiesByCategory = async (
  category: string
): Promise<ITechnologiesListResponse> => {
  const response = await apiClient.get<ITechnologiesListResponse>(
    `/technologies/category/${category}`
  );
  return response.data;
};

export const createTechnology = async (
  data: ICreateTechnologyRequest
): Promise<ITechnologyResponse> => {
  const response = await apiClient.post<ITechnologyResponse>(
    "/technologies",
    data
  );
  return response.data;
};

export const updateTechnology = async (
  id: string,
  data: IUpdateTechnologyRequest
): Promise<ITechnologyResponse> => {
  const response = await apiClient.patch<ITechnologyResponse>(
    `/technologies/${id}`,
    data
  );
  return response.data;
};

export const deleteTechnology = async (id: string): Promise<void> => {
  await apiClient.delete(`/technologies/${id}`);
};
