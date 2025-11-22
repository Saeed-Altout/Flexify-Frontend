import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonials-api";
import { IQueryTestimonialParams } from "./testimonials-type";
import { toast } from "sonner";

export const useTestimonialsQuery = (params?: IQueryTestimonialParams) => {
  return useQuery({
    queryKey: ["testimonials", params],
    queryFn: () => getTestimonials(params),
  });
};

export const useTestimonialQuery = (id: string) => {
  return useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => getTestimonialById(id),
    enabled: !!id,
  });
};

export const useCreateTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create testimonial");
    },
  });
};

export const useUpdateTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTestimonial(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonial", variables.id] });
      toast.success("Testimonial updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update testimonial");
    },
  });
};

export const useDeleteTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete testimonial");
    },
  });
};

