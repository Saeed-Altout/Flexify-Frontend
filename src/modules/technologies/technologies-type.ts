import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type ITechnology = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type ICreateTechnologyRequest = {
  slug: string;
  name: string;
  icon?: string;
  description?: string;
  category?: string;
  orderIndex?: number;
};

export type IUpdateTechnologyRequest = Partial<
  Omit<ICreateTechnologyRequest, "slug">
>;

export type IQueryTechnologyParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "order_index" | "name";
  sortOrder?: "asc" | "desc";
};

export type ITechnologyResponse = IApiResponse<{ data: ITechnology }>;

export type ITechnologiesResponse = IApiResponse<{
  data: ITechnology[];
  meta?: IPaginationMeta;
}>;

export type ITechnologiesListResponse = IApiResponse<{
  data: {
    technologies: ITechnology[];
  };
}>;
