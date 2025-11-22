import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "./contacts-api";
import { IQueryContactParams } from "./contacts-type";
import { toast } from "sonner";

export const useContactsQuery = (params?: IQueryContactParams) => {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => getContacts(params),
  });
};

export const useContactQuery = (id: string) => {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById(id),
    enabled: !!id,
  });
};

export const useCreateContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit contact");
    },
  });
};

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", variables.id] });
      toast.success("Contact updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update contact");
    },
  });
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete contact");
    },
  });
};

