import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type ITestimonialTranslation = {
  id: string;
  testimonialId: string;
  locale: string;
  content: string;
  authorName: string;
  authorPosition: string | null;
  company: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ITestimonial = {
  id: string;
  avatarUrl: string | null;
  rating: number | null;
  isFeatured: boolean;
  isApproved: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  translations?: ITestimonialTranslation[];
};

export type ICreateTestimonialTranslationRequest = {
  locale: string;
  content: string;
  authorName: string;
  authorPosition?: string;
  company?: string;
};

export type ICreateTestimonialRequest = {
  avatarUrl?: string;
  rating?: number;
  isFeatured?: boolean;
  isApproved?: boolean;
  orderIndex?: number;
  translations: ICreateTestimonialTranslationRequest[];
};

export type IUpdateTestimonialRequest = Partial<ICreateTestimonialRequest>;

export type IQueryTestimonialParams = {
  search?: string;
  isFeatured?: boolean;
  isApproved?: boolean;
  locale?: string;
  sortBy?: "created_at" | "updated_at" | "order_index" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type ITestimonialResponse = IApiResponse<{ data: ITestimonial }>;

export type ITestimonialsResponse = IApiResponse<{
  data: ITestimonial[];
  meta: IPaginationMeta;
}>;

