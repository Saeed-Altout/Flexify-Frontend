import { apiClient } from "@/lib/axios";
import {
  ICreateUserRequest,
  IUpdateUserRequest,
  IUpdateProfileRequest,
  IQueryUserParams,
  IUserResponse,
  IUsersResponse,
  IUploadAvatarResponse,
} from "@/modules/users/users-type";

export const getUsers = async (
  params?: IQueryUserParams
): Promise<IUsersResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<IUsersResponse>("/users", {
    params: queryParams,
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<IUserResponse> => {
  const response = await apiClient.get<IUserResponse>(`/users/${id}`);
  return response.data;
};

export const createUser = async (
  data: ICreateUserRequest
): Promise<IUserResponse> => {
  const response = await apiClient.post<IUserResponse>("/users", data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: IUpdateUserRequest
): Promise<IUserResponse> => {
  const response = await apiClient.patch<IUserResponse>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const updateProfile = async (
  data: IUpdateProfileRequest
): Promise<IUserResponse> => {
  const response = await apiClient.patch<IUserResponse>("/users/me", data);
  return response.data;
};

export const uploadAvatar = async (
  file: File
): Promise<IUploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<IUploadAvatarResponse>(
    "/users/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
