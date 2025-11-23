import { apiClient } from "@/lib/axios";
import { IApiResponse } from "@/types/api-type";
import {
  ICreateTestimonialRequest,
  IUpdateTestimonialRequest,
  IQueryTestimonialParams,
  ITestimonialResponse,
  ITestimonialsResponse,
} from "./testimonials-type";

export type IUploadAvatarResponse = IApiResponse<{ avatarUrl: string }>;

export const getTestimonials = async (
  params?: IQueryTestimonialParams
): Promise<ITestimonialsResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<ITestimonialsResponse>("/testimonials", {
    params: queryParams,
  });
  return response.data;
};

export const getTestimonialById = async (
  id: string
): Promise<ITestimonialResponse> => {
  const response = await apiClient.get<ITestimonialResponse>(
    `/testimonials/${id}`
  );
  return response.data;
};

export const createTestimonial = async (
  data: ICreateTestimonialRequest
): Promise<ITestimonialResponse> => {
  const response = await apiClient.post<ITestimonialResponse>(
    "/testimonials",
    data
  );
  return response.data;
};

export const updateTestimonial = async (
  id: string,
  data: IUpdateTestimonialRequest
): Promise<ITestimonialResponse> => {
  const response = await apiClient.patch<ITestimonialResponse>(
    `/testimonials/${id}`,
    data
  );
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await apiClient.delete(`/testimonials/${id}`);
};

// ========================================
// TESTIMONIAL AVATAR UPLOAD
// ========================================

export const uploadTestimonialAvatar = async (
  testimonialId: string,
  file: File
): Promise<IUploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<IUploadAvatarResponse>(
    `/testimonials/${testimonialId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

