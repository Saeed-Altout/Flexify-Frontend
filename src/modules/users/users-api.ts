import { apiClient } from '@/lib/axios';
import {
  ICreateUserRequest,
  IUpdateUserRequest,
  IQueryUserParams,
  IUserResponse,
  IUsersListResponse,
} from './users-type';

// Generic API Response type
interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string | object;
  lang?: string;
  timestamp: string;
}

export const getUsers = async (params?: IQueryUserParams): Promise<IUsersListResponse> => {
  const response = await apiClient.get<IApiResponse<IUsersListResponse>>(
    '/users',
    { params }
  );
  return response.data.data;
};

export const getUserById = async (id: string): Promise<IUserResponse> => {
  const response = await apiClient.get<IApiResponse<IUserResponse>>(
    `/users/${id}`
  );
  return response.data.data;
};

export const createUser = async (data: ICreateUserRequest): Promise<IUserResponse> => {
  const response = await apiClient.post<IApiResponse<IUserResponse>>(
    '/users',
    data
  );
  return response.data.data;
};

export const updateUser = async (id: string, data: IUpdateUserRequest): Promise<IUserResponse> => {
  const response = await apiClient.patch<IApiResponse<IUserResponse>>(
    `/users/${id}`,
    data
  );
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const updateProfile = async (
  data: IUpdateProfileRequest
): Promise<IUserResponse> => {
  const response = await apiClient.patch<IApiResponse<IUserResponse>>(
    "/users/me",
    data
  );
  return response.data.data;
};

export const uploadAvatar = async (file: File): Promise<IUploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await apiClient.post<IApiResponse<IUploadAvatarResponse>>(
    "/users/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

