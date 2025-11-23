import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTechnologies,
  getTechnologyById,
  getTechnologiesByCategory,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "./technologies-api";
import { IQueryTechnologyParams } from "./technologies-type";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useTechnologiesQuery = (params?: IQueryTechnologyParams) => {
  return useQuery({
    queryKey: ["technologies", params],
    queryFn: () => getTechnologies(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTechnologyQuery = (id: string) => {
  return useQuery({
    queryKey: ["technology", id],
    queryFn: () => getTechnologyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTechnologiesByCategoryQuery = (category: string) => {
  return useQuery({
    queryKey: ["technologies", "category", category],
    queryFn: () => getTechnologiesByCategory(category),
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
};

export const useCreateTechnologyMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.technologies.message");

  return useMutation({
    mutationFn: createTechnology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      toast.success(t("createSuccess") || "Technology created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("createError") || "Failed to create technology");
    },
  });
};

export const useUpdateTechnologyMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.technologies.message");

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTechnology(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({ queryKey: ["technology", variables.id] });
      toast.success(t("updateSuccess") || "Technology updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("updateError") || "Failed to update technology");
    },
  });
};

export const useDeleteTechnologyMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.technologies.message");

  return useMutation({
    mutationFn: deleteTechnology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      toast.success(t("deleteSuccess") || "Technology deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("deleteError") || "Failed to delete technology");
    },
  });
};

