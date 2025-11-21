import { AxiosError } from "axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  uploadAvatar,
} from "@/modules/users/users-api";
import {
  ICreateUserRequest,
  IUpdateUserRequest,
  IQueryUserParams,
  IUpdateProfileRequest,
} from "@/modules/users/users-type";

export const useUsersQuery = (params?: IQueryUserParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.users.message");

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data: ICreateUserRequest) => createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message || t("createSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("createError"));
      }
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.users.message");

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
      toast.success(response.message || t("updateSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("updateError"));
      }
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.users.message");

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("deleteError"));
      }
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.users.message");

  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: IUpdateProfileRequest) => updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message || t("updateSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("updateError"));
      }
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.users.message");

  return useMutation({
    mutationKey: ["uploadAvatar"],
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message || t("uploadSuccess"));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("uploadError"));
      }
    },
  });
};
