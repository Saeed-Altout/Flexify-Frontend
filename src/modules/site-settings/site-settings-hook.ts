import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNavbarLinks,
  getAllNavbarLinks,
  createNavbarLink,
  updateNavbarLink,
  deleteNavbarLink,
  getSiteSetting,
  getAllSiteSettings,
  updateSiteSetting,
  updateSiteSettingTranslation,
} from "./site-settings-api";
import { toast } from "sonner";

// =====================================================
// NAVBAR LINKS HOOKS
// =====================================================

export const useNavbarLinksQuery = (locale?: string) => {
  return useQuery({
    queryKey: ["navbar-links", locale],
    queryFn: () => getNavbarLinks(locale),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllNavbarLinksQuery = () => {
  return useQuery({
    queryKey: ["navbar-links", "all"],
    queryFn: () => getAllNavbarLinks(),
  });
};

export const useCreateNavbarLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNavbarLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navbar-links"] });
      toast.success("Navbar link created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create navbar link"
      );
    },
  });
};

export const useUpdateNavbarLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateNavbarLink(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["navbar-links"] });
      toast.success("Navbar link updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update navbar link"
      );
    },
  });
};

export const useDeleteNavbarLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNavbarLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navbar-links"] });
      toast.success("Navbar link deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete navbar link"
      );
    },
  });
};

// =====================================================
// SITE SETTINGS HOOKS
// =====================================================

export const useSiteSettingQuery = (key: string, locale?: string) => {
  return useQuery({
    queryKey: ["site-setting", key, locale],
    queryFn: () => getSiteSetting(key, locale),
    enabled: !!key,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllSiteSettingsQuery = () => {
  return useQuery({
    queryKey: ["site-settings", "all"],
    queryFn: () => getAllSiteSettings(),
  });
};

export const useUpdateSiteSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: any }) =>
      updateSiteSetting(key, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site-setting", variables.key] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Setting updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update setting");
    },
  });
};

export const useUpdateSiteSettingTranslationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      key,
      data,
    }: {
      key: string;
      data: IUpdateSiteSettingTranslationRequest;
    }) => updateSiteSettingTranslation(key, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["site-setting", variables.key],
      });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Translation updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update translation"
      );
    },
  });
};

// Import type for mutation
import type { IUpdateSiteSettingTranslationRequest } from "./site-settings-type";
import { uploadCV } from "./site-settings-api";

// =====================================================
// CV UPLOAD HOOK
// =====================================================

export const useUploadCVMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-setting", "cv"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("CV uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload CV");
    },
  });
};

