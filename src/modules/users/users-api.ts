import { apiClient } from '@/lib/axios';
import {
  ICreateUserRequest,
  IUpdateUserRequest,
  IQueryUserParams,
  IUserResponse,
  IUsersListResponse,
} from './users-type';
import type { IArrayApiResponse, ISingleItemApiResponse } from '@/types/api-response';

export const getUsers = async (params?: IQueryUserParams): Promise<IUsersListResponse> => {
  const response = await apiClient.get<IArrayApiResponse<IUser>>(
    '/users',
    { params }
  );
  // Extract data from nested structure: response.data.data.data (array) and response.data.data.meta
  if (response.data.data && 'data' in response.data.data && 'meta' in response.data.data) {
    return {
      users: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.page,
      limit: response.data.data.meta.limit,
      totalPages: response.data.data.meta.totalPages,
    };
  }
  throw new Error('Invalid response format');
};

export const getUserById = async (id: string): Promise<IUserResponse> => {
  const response = await apiClient.get<ISingleItemApiResponse<IUser>>(
    `/users/${id}`
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && 'data' in response.data.data) {
    return { user: response.data.data.data };
  }
  throw new Error('Invalid response format');
};

export const createUser = async (data: ICreateUserRequest): Promise<IUserResponse> => {
  const response = await apiClient.post<ISingleItemApiResponse<IUser>>(
    '/users',
    data
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && 'data' in response.data.data) {
    return { user: response.data.data.data };
  }
  throw new Error('Invalid response format');
};

export const updateUser = async (id: string, data: IUpdateUserRequest): Promise<IUserResponse> => {
  const response = await apiClient.patch<ISingleItemApiResponse<IUser>>(
    `/users/${id}`,
    data
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && 'data' in response.data.data) {
    return { user: response.data.data.data };
  }
  throw new Error('Invalid response format');
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const updateProfile = async (
  data: IUpdateProfileRequest
): Promise<IUserResponse> => {
  const response = await apiClient.patch<ISingleItemApiResponse<IUser>>(
    "/users/me",
    data
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && 'data' in response.data.data) {
    return { user: response.data.data.data };
  }
  throw new Error('Invalid response format');
};

export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await apiClient.post<ISingleItemApiResponse<{ avatarUrl: string }>>(
    "/users/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && 'data' in response.data.data) {
    return response.data.data.data;
  }
  throw new Error('Invalid response format');
};

