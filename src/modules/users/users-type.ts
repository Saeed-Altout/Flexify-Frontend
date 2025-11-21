import {
  IApiResponse,
  IPaginationMeta,
  IUserRole,
  IUserSortBy,
  IUserSortOrder,
} from "@/types/api-type";

export type IUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: IUserRole;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ICreateUserRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: IUserRole;
};

export type IUpdateUserRequest = {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  role?: IUserRole;
};

export type IUpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type IQueryUserParams = {
  search?: string;
  role?: IUserRole | string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: IUserSortBy;
  sortOrder?: IUserSortOrder;
};

export type IUserResponse = IApiResponse<{ data: IUser }>;

export type IUsersResponse = IApiResponse<{
  data: IUser[];
  meta: IPaginationMeta;
}>;
export type IUploadAvatarResponse = IApiResponse<{
  data: { avatarUrl: string };
}>;
