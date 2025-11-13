/**
 * Centralized Type Definitions
 *
 * This file contains all type definitions for the application,
 * ensuring type safety across the frontend and alignment with the backend.
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response structure from the backend
 * @template T - The type of data in the response
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string | object;
  lang?: string;
  timestamp: string;
};

/**
 * Error response structure
 */
export type ApiErrorResponse = ApiResponse<null> & {
  success: false;
  error: string | object;
};

/**
 * Success response structure
 * @template T - The type of data in the response
 */
export type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};

// ============================================================================
// User Types
// ============================================================================

/**
 * User role types
 */
export type UserRole = "admin" | "user" | "moderator";

/**
 * User status types
 */
export type UserStatus = "active" | "inactive" | "suspended" | "banned";

/**
 * User entity from the backend (matches server/src/modules/users/entities/user.entity.ts)
 */
export type User = {
  id: string;
  email: string;
  password_hash?: string; // Only present in backend, never sent to frontend
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  phone_verified: boolean;
  provider: string | null;
  provider_id: string | null;
  language: string;
  timezone: string | null;
  metadata: Record<string, unknown>;
  settings: Record<string, unknown>;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

/**
 * Public user data (user data without sensitive information)
 */
export type PublicUser = Omit<
  User,
  "password_hash" | "deleted_at" | "metadata" | "settings"
>;

/**
 * User data returned in auth responses
 */
export type AuthUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  email_verified: boolean;
  phone_verified?: boolean;
  avatar_url?: string | null;
  language?: string;
  timezone?: string | null;
  created_at?: Date;
};

/**
 * User profile data for display
 */
export type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  phone_verified: boolean;
  language: string;
  timezone: string | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

// ============================================================================
// Session Types
// ============================================================================

/**
 * Session entity from the backend (matches server/src/modules/auth/entities/session.entity.ts)
 */
export type Session = {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  device_name: string | null;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Session data for client-side use
 */
export type ClientSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
};

/**
 * Session with user data
 */
export type SessionWithUser = {
  session: Session;
  user: User;
};

// ============================================================================
// Auth Request DTOs (matches backend DTOs)
// ============================================================================

/**
 * Login request (matches server/src/modules/auth/dtos/login.dto.ts)
 */
export type LoginDto = {
  email: string;
  password: string;
};

/**
 * Register request (matches server/src/modules/auth/dtos/register.dto.ts)
 */
export type RegisterDto = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

/**
 * Quick register request (matches server/src/modules/auth/dtos/quick-register.dto.ts)
 */
export type QuickRegisterDto = {
  email: string;
  password: string;
};

/**
 * Forget password request (matches server/src/modules/auth/dtos/forget-password.dto.ts)
 */
export type ForgetPasswordDto = {
  email: string;
};

/**
 * Reset password request (matches server/src/modules/auth/dtos/reset-password.dto.ts)
 */
export type ResetPasswordDto = {
  token: string;
  password: string;
};

/**
 * Verify account request (matches server/src/modules/auth/dtos/verify-account.dto.ts)
 */
export type VerifyAccountDto = {
  email: string;
  code: string;
};

/**
 * Send verification code request
 */
export type SendVerificationCodeDto = {
  email: string;
};

// ============================================================================
// Auth Response Types
// ============================================================================

/**
 * Login response (matches server/src/modules/auth/dtos/login-response.dto.ts)
 */
export type LoginResponse = {
  user: AuthUser;
  session_token: string;
};

/**
 * Register response
 */
export type RegisterResponse = {
  user: AuthUser;
  session_token: string;
};

/**
 * Auth success response from API
 */
export type AuthSuccessResponse = ApiSuccessResponse<LoginResponse>;

/**
 * Session verification response
 */
export type SessionVerificationResponse = {
  user: AuthUser;
  session: {
    id: string;
    expires_at: Date;
  };
};

// ============================================================================
// Form Types
// ============================================================================

/**
 * Login form values
 */
export type LoginFormValues = {
  email: string;
  password: string;
};

/**
 * Register form values
 */
export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Forget password form values
 */
export type ForgetPasswordFormValues = {
  email: string;
};

/**
 * Reset password form values
 */
export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

/**
 * Verify account form values
 */
export type VerifyAccountFormValues = {
  otp: string;
};

// ============================================================================
// Mutation Types (for React Query)
// ============================================================================

/**
 * Sign in mutation variables
 */
export type SignInVariables = {
  email: string;
  password: string;
};

/**
 * Sign up mutation variables
 */
export type SignUpVariables = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Forgot password mutation variables
 */
export type ForgotPasswordVariables = {
  email: string;
};

/**
 * Reset password mutation variables
 */
export type ResetPasswordVariables = {
  token: string;
  password: string;
};

/**
 * Verify account mutation variables
 */
export type VerifyAccountVariables = {
  email: string;
  code: string;
};

/**
 * Send verification code mutation variables
 */
export type SendVerificationCodeVariables = {
  email: string;
};

/**
 * Mutation result type
 */
export type MutationResult<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
};

// ============================================================================
// Server Action Types
// ============================================================================

/**
 * Server action result type
 */
export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make specific fields required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific fields optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Extract data type from API response
 */
export type ExtractApiData<T> = T extends ApiResponse<infer D> ? D : never;

/**
 * Language codes
 */
export type LanguageCode = "en" | "ar";

/**
 * Pagination types
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

// ============================================================================
// Project Types
// ============================================================================

/**
 * Project entity
 */
export interface Project {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  tech_stack: string[];
  role: string;
  responsibilities: string[];
  architecture: string | null;
  features: string[];
  challenges: string[];
  solutions: string[];
  lessons: string[];
  github_url: string | null;
  github_backend_url: string | null;
  live_demo_url: string | null;
  video_demo_url: string | null;
  main_image: string | null;
  images: string[];
  average_rating: number;
  total_ratings: number;
  total_likes: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  user_liked?: boolean;
  user_rating?: number | null;
  translations?: ProjectTranslation[];
  user?: PublicUser;
}

/**
 * Project translation
 */
export interface ProjectTranslation {
  id: string;
  project_id: string;
  language: string;
  title: string;
  summary: string;
  description: string;
  architecture: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create project DTO
 */
export interface CreateProjectDto {
  title: string;
  slug: string;
  summary: string;
  description: string;
  tech_stack: string[];
  role: string;
  responsibilities?: string[];
  architecture?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  lessons?: string[];
  github_url?: string;
  github_backend_url?: string;
  live_demo_url?: string;
  video_demo_url?: string;
  main_image?: string;
  images?: string[];
  is_published?: boolean;
  translations?: ProjectTranslationDto[];
}

/**
 * Project translation DTO
 */
export interface ProjectTranslationDto {
  language: string;
  title: string;
  summary: string;
  description: string;
  architecture?: string;
}

/**
 * Update project DTO
 */
export type UpdateProjectDto = Partial<CreateProjectDto>;

/**
 * Rate project DTO
 */
export interface RateProjectDto {
  rating: number; // 1-5
}

/**
 * Query projects DTO
 */
export interface QueryProjectsDto {
  search?: string;
  tech_stack?: string;
  is_published?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "ASC" | "DESC";
}

/**
 * Projects list response
 */
export interface ProjectsListResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Form component props
 */
export type FormProps<T> = {
  onSubmit?: (values: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
};

/**
 * Button loading state
 */
export type ButtonLoadingState = {
  loading?: boolean;
  disabled?: boolean;
};

// ============================================================================
// Environment Types
// ============================================================================

/**
 * Environment variables type
 */
export type Env = {
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_BACKEND_URL?: string;
  BACKEND_URL?: string;
  NODE_ENV?: "development" | "production" | "test";
};

// ============================================================================
// Error Types
// ============================================================================

/**
 * Application error types
 */
export type AppError = {
  code: string;
  message: string;
  details?: unknown;
};

/**
 * Validation error
 */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * Form errors
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

// ============================================================================
// Route Types
// ============================================================================

/**
 * Route parameters
 */
export type RouteParams = {
  locale?: string;
  [key: string]: string | string[] | undefined;
};

/**
 * Search params
 */
export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// ============================================================================
// Better Auth Types (for compatibility)
// ============================================================================

/**
 * Better Auth user type (compatible with adapter)
 */
export type BetterAuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Better Auth session type (compatible with adapter)
 */
export type BetterAuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
};
