import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInquiryTypes,
  getInquiryTypeById,
  getInquiryTypeBySlug,
  createInquiryType,
  updateInquiryType,
  deleteInquiryType,
} from "./inquiry-types-api";
import { IQueryInquiryTypeParams } from "./inquiry-types-type";
import { toast } from "sonner";

export const useInquiryTypesQuery = (params?: IQueryInquiryTypeParams) => {
  return useQuery({
    queryKey: ["inquiry-types", params],
    queryFn: () => getInquiryTypes(params),
  });
};

export const useInquiryTypeQuery = (id: string) => {
  return useQuery({
    queryKey: ["inquiry-type", id],
    queryFn: () => getInquiryTypeById(id),
    enabled: !!id,
  });
};

export const useInquiryTypeBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["inquiry-type", "slug", slug],
    queryFn: () => getInquiryTypeBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateInquiryTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInquiryType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiry-types"] });
      toast.success("Inquiry type created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create inquiry type");
    },
  });
};

export const useUpdateInquiryTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateInquiryType(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiry-types"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry-type", variables.id] });
      toast.success("Inquiry type updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update inquiry type");
    },
  });
};

export const useDeleteInquiryTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInquiryType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiry-types"] });
      toast.success("Inquiry type deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete inquiry type");
    },
  });
};

