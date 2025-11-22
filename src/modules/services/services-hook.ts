import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from "./services-api";
import { IQueryServiceParams } from "./services-type";
import { toast } from "sonner";

export const useServicesQuery = (params?: IQueryServiceParams) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
  });
};

export const useServiceQuery = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
};

export const useServiceBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["service", "slug", slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create service");
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", variables.id] });
      toast.success("Service updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update service");
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete service");
    },
  });
};

