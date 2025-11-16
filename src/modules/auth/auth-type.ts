export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}

export interface IVerifyEmailRequest {
  verificationToken: string; // UUID token from registration
  otp: string; // 6-digit OTP code
}

export interface IResendVerificationRequest {
  email: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: string;
}

export interface IAuthResponse {
  user: IUser;
  tokens: IAuthTokens;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

