import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type IInquiryTypeTranslation = {
  id: string;
  inquiryTypeId: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IInquiryType = {
  id: string;
  slug: string;
  icon: string | null;
  color: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: IInquiryTypeTranslation[];
};

export type ICreateInquiryTypeTranslationRequest = {
  locale: string;
  name: string;
  description?: string;
};

export type ICreateInquiryTypeRequest = {
  slug: string;
  icon?: string;
  color?: string;
  orderIndex?: number;
  isActive?: boolean;
  translations: ICreateInquiryTypeTranslationRequest[];
};

export type IUpdateInquiryTypeRequest = Partial<
  Omit<ICreateInquiryTypeRequest, "slug">
>;

export type IQueryInquiryTypeParams = {
  search?: string;
  isActive?: boolean;
  locale?: string;
  sortBy?: "created_at" | "updated_at" | "order_index" | "name";
  sortOrder?: "asc" | "desc";
};

export type IInquiryTypeResponse = IApiResponse<{ data: IInquiryType }>;

export type IInquiryTypesResponse = IApiResponse<{
  data: IInquiryType[];
  meta: IPaginationMeta;
}>;

