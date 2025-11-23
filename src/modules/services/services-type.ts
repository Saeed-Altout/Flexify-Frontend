import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type IServiceTranslation = {
  id: string;
  serviceId: string;
  locale: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IService = {
  id: string;
  slug: string;
  icon: string | null;
  imageUrl: string | null;
  orderIndex: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: IServiceTranslation[];
};

export type ICreateServiceTranslationRequest = {
  locale: string;
  name: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type ICreateServiceRequest = {
  slug: string;
  icon?: string;
  imageUrl?: string;
  orderIndex?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  translations: ICreateServiceTranslationRequest[];
};

export type IUpdateServiceRequest = Partial<
  Omit<ICreateServiceRequest, "slug">
>;

export type IQueryServiceParams = {
  search?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  locale?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "order_index" | "name";
  sortOrder?: "asc" | "desc";
};

export type IServiceResponse = IApiResponse<{ data: IService }>;

export type IServicesResponse = IApiResponse<{
  data: IService[];
  meta: IPaginationMeta;
}>;

