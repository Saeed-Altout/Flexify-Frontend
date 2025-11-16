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
} from "./auth-type";

// Generic API Response type
interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string | object;
  lang?: string;
  timestamp: string;
}

export const login = async (data: ILoginRequest): Promise<IAuthResponse> => {
  const response = await apiClient.post<IApiResponse<IAuthResponse>>(
    "/auth/login",
    data
  );
  return response.data.data;
};

export const register = async (
  data: IRegisterRequest
): Promise<{ user: IUser; verificationToken: string }> => {
  const response = await apiClient.post<IApiResponse<{ user: IUser; verificationToken: string }>>(
    "/auth/register",
    data
  );
  return response.data.data;
};

export const refreshToken = async (
  data: IRefreshTokenRequest
): Promise<IRefreshTokenResponse> => {
  const response = await apiClient.post<IApiResponse<IRefreshTokenResponse>>(
    "/auth/refresh",
    data
  );
  return response.data.data;
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

export const resendVerification = async (data: IResendVerificationRequest): Promise<void> => {
  await apiClient.post("/auth/resend-verification", data);
};

export const getCurrentUser = async (): Promise<IUser> => {
  const response = await apiClient.get<IApiResponse<IUser>>("/auth/me");
  return response.data.data;
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
