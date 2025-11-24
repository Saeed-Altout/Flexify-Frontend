import { apiClient } from "@/lib/axios";
import type { IApiResponse } from "@/types/api-type";
import {
  INavbarLinkResponse,
  INavbarLinksResponse,
  ISiteSettingResponse,
  ISiteSettingsResponse,
  ICreateNavbarLinkRequest,
  IUpdateNavbarLinkRequest,
  IUpdateSiteSettingRequest,
  IUpdateSiteSettingTranslationRequest,
} from "./site-settings-type";

// =====================================================
// NAVBAR LINKS
// =====================================================

export const getNavbarLinks = async (
  locale?: string
): Promise<INavbarLinksResponse> => {
  const params = locale ? { locale } : {};
  const response = await apiClient.get<INavbarLinksResponse>(
    "/site-settings/navbar-links",
    { params }
  );
  return response.data;
};

export const getAllNavbarLinks = async (): Promise<INavbarLinksResponse> => {
  const response = await apiClient.get<INavbarLinksResponse>(
    "/site-settings/navbar-links/all"
  );
  return response.data;
};

export const createNavbarLink = async (
  data: ICreateNavbarLinkRequest
): Promise<INavbarLinkResponse> => {
  const response = await apiClient.post<INavbarLinkResponse>(
    "/site-settings/navbar-links",
    data
  );
  return response.data;
};

export const updateNavbarLink = async (
  id: string,
  data: IUpdateNavbarLinkRequest
): Promise<INavbarLinkResponse> => {
  const response = await apiClient.patch<INavbarLinkResponse>(
    `/site-settings/navbar-links/${id}`,
    data
  );
  return response.data;
};

export const deleteNavbarLink = async (id: string): Promise<void> => {
  await apiClient.delete(`/site-settings/navbar-links/${id}`);
};

// =====================================================
// SITE SETTINGS
// =====================================================

export const getSiteSetting = async (
  key: string,
  locale?: string
): Promise<ISiteSettingResponse> => {
  const params = locale ? { locale } : {};
  const response = await apiClient.get<ISiteSettingResponse>(
    `/site-settings/settings/${key}`,
    { params }
  );
  return response.data;
};

export const getAllSiteSettings = async (): Promise<ISiteSettingsResponse> => {
  const response = await apiClient.get<ISiteSettingsResponse>(
    "/site-settings/settings"
  );
  return response.data;
};

export const updateSiteSetting = async (
  key: string,
  data: IUpdateSiteSettingRequest
): Promise<ISiteSettingResponse> => {
  const response = await apiClient.patch<ISiteSettingResponse>(
    `/site-settings/settings/${key}`,
    data
  );
  return response.data;
};

export const updateSiteSettingTranslation = async (
  key: string,
  data: IUpdateSiteSettingTranslationRequest
): Promise<ISiteSettingResponse> => {
  const response = await apiClient.patch<ISiteSettingResponse>(
    `/site-settings/settings/${key}/translations`,
    data
  );
  return response.data;
};

// =====================================================
// CV UPLOAD
// =====================================================

export type IUploadCVResponse = IApiResponse<{ url: string; fileName: string }>;

export const uploadCV = async (file: File): Promise<IUploadCVResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<IUploadCVResponse>(
    "/site-settings/cv/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

