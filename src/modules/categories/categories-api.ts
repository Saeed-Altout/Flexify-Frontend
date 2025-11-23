import { apiClient } from "@/lib/axios";
import type { IApiResponse } from "@/types/api-type";
import {
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  IQueryCategoryParams,
  ICategoryResponse,
  ICategoriesResponse,
  ICategoriesListResponse,
} from "./categories-type";

export const getCategories = async (
  params?: IQueryCategoryParams
): Promise<ICategoriesResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  // Server returns: { status, message, data: { data: { categories: ICategory[] } } }
  const response = await apiClient.get<ICategoriesListResponse>("/categories", {
    params: queryParams,
  });
  
  // Transform the response to match expected format
  // Response structure: response.data.data.data.categories
  const categories = response.data.data?.data?.categories || [];
  
  // Apply client-side filtering if needed (since server doesn't support pagination yet)
  let filtered = categories;
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = categories.filter(
      (cat) =>
        (cat.name || "").toLowerCase().includes(searchLower) ||
        (cat.description || "").toLowerCase().includes(searchLower) ||
        cat.slug.toLowerCase().includes(searchLower)
    );
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
  } as ICategoriesResponse;
};

export const getCategoryById = async (id: string): Promise<ICategoryResponse> => {
  const response = await apiClient.get<ICategoryResponse>(`/categories/${id}`);
  // Response structure: { status, message, data: { data: ICategory } }
  return response.data;
};

export const createCategory = async (
  data: ICreateCategoryRequest
): Promise<ICategoryResponse> => {
  const response = await apiClient.post<ICategoryResponse>("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: IUpdateCategoryRequest
): Promise<ICategoryResponse> => {
  const response = await apiClient.patch<ICategoryResponse>(
    `/categories/${id}`,
    data
  );
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

