import { IApiResponse } from "@/types/api-type";
import { IUser } from "@/modules/users/users-type";

export type ILoginRequest = {
  email: string;
  password: string;
};

export type ILoginResponse = IApiResponse<{
  user: IUser;
  tokens: IAuthTokens;
}>;

export type IRegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type IRegisterResponse = IApiResponse<{
  user: IUser;
  verificationToken: string;
}>;

export type IForgotPasswordRequest = {
  email: string;
};

export type IForgotPasswordResponse = IApiResponse<void>;

export type IResetPasswordRequest = {
  token: string;
  password: string;
};

export type IResetPasswordResponse = IApiResponse<void>;

export type IVerifyEmailRequest = {
  verificationToken: string;
  otp: string;
};

export type IVerifyEmailResponse = IApiResponse<void>;

export type IResendVerificationRequest = {
  email: string;
};

export type IResendVerificationResponse = IApiResponse<void>;

export type IRefreshTokenRequest = {
  refreshToken: string;
};

export type IAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type IUserResponse = IApiResponse<{ data: IUser }>;

export type IRefreshTokenResponse = IApiResponse<IAuthTokens>;

export type IChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type IChangePasswordResponse = IApiResponse<void>;

export type ILogoutResponse = IApiResponse<void>;
