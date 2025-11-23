import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories-api";
import { IQueryCategoryParams } from "./categories-type";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useCategoriesQuery = (params?: IQueryCategoryParams) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.categories.message");

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("createSuccess") || "Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("createError") || "Failed to create category");
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.categories.message");

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      toast.success(t("updateSuccess") || "Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("updateError") || "Failed to update category");
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.categories.message");

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("deleteSuccess") || "Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("deleteError") || "Failed to delete category");
    },
  });
};

