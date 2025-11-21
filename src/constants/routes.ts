export const Routes = {
  home: "/",
  dashboard: "/dashboard",
  dashboardProfile: "/dashboard/profile",
  dashboardUsers: "/dashboard/users",
  dashboardUserDetail: (id: string) => `/dashboard/users/${id}`,
  login: "/auth/login",
  register: "/auth/register",
  verifyAccount: "/auth/verify-account",
  forgetPassword: "/auth/forget-password",
  resetPassword: "/auth/reset-password",
};
