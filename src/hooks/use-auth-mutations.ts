// Re-export auth hooks from modules
export {
  useSignInMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} from '@/modules/auth/auth-hook';

// Alias for logout mutation
export const useSignOutMutation = useLogoutMutation;

