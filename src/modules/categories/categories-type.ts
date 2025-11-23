import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type ICategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type ICreateCategoryRequest = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
};

export type IUpdateCategoryRequest = Partial<
  Omit<ICreateCategoryRequest, "slug">
>;

export type IQueryCategoryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "order_index" | "name_en" | "name_ar";
  sortOrder?: "asc" | "desc";
};

export type ICategoryResponse = IApiResponse<{ data: ICategory }>;

export type ICategoriesResponse = IApiResponse<{
  data: ICategory[];
  meta?: IPaginationMeta;
}>;

export type ICategoriesListResponse = IApiResponse<{
  data: {
    categories: ICategory[];
  };
}>;
