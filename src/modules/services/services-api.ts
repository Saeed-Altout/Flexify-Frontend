import { apiClient } from "@/lib/axios";
import type { IApiResponse } from "@/types/api-type";
import {
  ICreateServiceRequest,
  IUpdateServiceRequest,
  IQueryServiceParams,
  IServiceResponse,
  IServicesResponse,
} from "./services-type";

export const getServices = async (
  params?: IQueryServiceParams
): Promise<IServicesResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<IServicesResponse>("/services", {
    params: queryParams,
  });
  return response.data;
};

export const getServiceById = async (id: string): Promise<IServiceResponse> => {
  const response = await apiClient.get<IServiceResponse>(`/services/${id}`);
  return response.data;
};

export const getServiceBySlug = async (
  slug: string
): Promise<IServiceResponse> => {
  const response = await apiClient.get<IServiceResponse>(
    `/services/slug/${slug}`
  );
  return response.data;
};

export const createService = async (
  data: ICreateServiceRequest
): Promise<IServiceResponse> => {
  const response = await apiClient.post<IServiceResponse>("/services", data);
  return response.data;
};

export const updateService = async (
  id: string,
  data: IUpdateServiceRequest
): Promise<IServiceResponse> => {
  const response = await apiClient.patch<IServiceResponse>(
    `/services/${id}`,
    data
  );
  return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await apiClient.delete(`/services/${id}`);
};

