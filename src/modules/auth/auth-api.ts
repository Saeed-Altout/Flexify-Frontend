import { apiClient } from "@/lib/axios";
import {
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyEmailRequest,
  IResendVerificationRequest,
  IRefreshTokenRequest,
  IAuthResponse,
  IRefreshTokenResponse,
  IUser,
  IChangePasswordRequest,
} from "./auth-type";
import type { ISingleItemApiResponse } from "@/types/api-response";

export const login = async (data: ILoginRequest): Promise<IAuthResponse> => {
  const response = await apiClient.post<ISingleItemApiResponse<IAuthResponse>>(
    "/auth/login",
    data
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && "data" in response.data.data) {
    return response.data.data.data;
  }
  throw new Error("Invalid response format");
};

export const register = async (
  data: IRegisterRequest
): Promise<{ user: IUser; verificationToken: string }> => {
  const response = await apiClient.post<
    ISingleItemApiResponse<{ user: IUser; verificationToken: string }>
  >("/auth/register", data);
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && "data" in response.data.data) {
    return response.data.data.data;
  }
  throw new Error("Invalid response format");
};

export const refreshToken = async (
  data: IRefreshTokenRequest
): Promise<IRefreshTokenResponse> => {
  const response = await apiClient.post<
    ISingleItemApiResponse<IRefreshTokenResponse>
  >("/auth/refresh", data);
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && "data" in response.data.data) {
    return response.data.data.data;
  }
  throw new Error("Invalid response format");
};

export const forgotPassword = async (
  data: IForgotPasswordRequest
): Promise<void> => {
  await apiClient.post("/auth/forgot-password", data);
};

export const resetPassword = async (
  data: IResetPasswordRequest
): Promise<void> => {
  await apiClient.post("/auth/reset-password", data);
};

export const verifyEmail = async (data: IVerifyEmailRequest): Promise<void> => {
  await apiClient.post("/auth/verify-email", data);
};

export const resendVerification = async (
  data: IResendVerificationRequest
): Promise<void> => {
  await apiClient.post("/auth/resend-verification", data);
};

export const getCurrentUser = async (): Promise<IUser> => {
  const response = await apiClient.get<ISingleItemApiResponse<IUser>>(
    "/auth/me"
  );
  // Extract data from nested structure: response.data.data.data
  if (response.data.data && "data" in response.data.data) {
    return response.data.data.data;
  }
  throw new Error("Invalid response format");
};

export const changePassword = async (
  data: IChangePasswordRequest
): Promise<void> => {
  await apiClient.post<ISingleItemApiResponse<null>>(
    "/auth/change-password",
    data
  );
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
