import { apiClient } from "@/lib/axios";
import {
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyEmailRequest,
  IResendVerificationRequest,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  IChangePasswordRequest,
  ILoginResponse,
  IRegisterResponse,
  IUserResponse,
  IChangePasswordResponse,
  ILogoutResponse,
  IVerifyEmailResponse,
  IResendVerificationResponse,
} from "@/modules/auth/auth-type";

export const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
  const response = await apiClient.post<ILoginResponse>("/auth/login", data);
  return response.data;
};

export const register = async (
  data: IRegisterRequest
): Promise<IRegisterResponse> => {
  const response = await apiClient.post<IRegisterResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

export const refreshToken = async (
  data: IRefreshTokenRequest
): Promise<IRefreshTokenResponse> => {
  const response = await apiClient.post<IRefreshTokenResponse>(
    "/auth/refresh",
    data
  );
  return response.data;
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

export const verifyEmail = async (
  data: IVerifyEmailRequest
): Promise<IVerifyEmailResponse> => {
  const response = await apiClient.post<IVerifyEmailResponse>(
    "/auth/verify-email",
    data
  );
  return response.data;
};

export const resendVerification = async (
  data: IResendVerificationRequest
): Promise<IResendVerificationResponse> => {
  const response = await apiClient.post<IResendVerificationResponse>(
    "/auth/resend-verification",
    data
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<IUserResponse> => {
  const response = await apiClient.get<IUserResponse>("/auth/me");
  return response.data;
};

export const changePassword = async (
  data: IChangePasswordRequest
): Promise<IChangePasswordResponse> => {
  const response = await apiClient.post<IChangePasswordResponse>(
    "/auth/change-password",
    data
  );
  return response.data;
};

export const logout = async (): Promise<ILogoutResponse> => {
  const response = await apiClient.post<ILogoutResponse>("/auth/logout");
  return response.data;
};
