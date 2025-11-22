import { apiClient } from "@/lib/axios";
import {
  ICreateInquiryTypeRequest,
  IUpdateInquiryTypeRequest,
  IQueryInquiryTypeParams,
  IInquiryTypeResponse,
  IInquiryTypesResponse,
} from "./inquiry-types-type";

export const getInquiryTypes = async (
  params?: IQueryInquiryTypeParams
): Promise<IInquiryTypesResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<IInquiryTypesResponse>("/inquiry-types", {
    params: queryParams,
  });
  return response.data;
};

export const getInquiryTypeById = async (
  id: string
): Promise<IInquiryTypeResponse> => {
  const response = await apiClient.get<IInquiryTypeResponse>(
    `/inquiry-types/${id}`
  );
  return response.data;
};

export const getInquiryTypeBySlug = async (
  slug: string
): Promise<IInquiryTypeResponse> => {
  const response = await apiClient.get<IInquiryTypeResponse>(
    `/inquiry-types/slug/${slug}`
  );
  return response.data;
};

export const createInquiryType = async (
  data: ICreateInquiryTypeRequest
): Promise<IInquiryTypeResponse> => {
  const response = await apiClient.post<IInquiryTypeResponse>(
    "/inquiry-types",
    data
  );
  return response.data;
};

export const updateInquiryType = async (
  id: string,
  data: IUpdateInquiryTypeRequest
): Promise<IInquiryTypeResponse> => {
  const response = await apiClient.patch<IInquiryTypeResponse>(
    `/inquiry-types/${id}`,
    data
  );
  return response.data;
};

export const deleteInquiryType = async (id: string): Promise<void> => {
  await apiClient.delete(`/inquiry-types/${id}`);
};

