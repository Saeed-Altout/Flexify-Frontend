import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser, IAuthTokens } from "@/modules/auth/auth-type";

interface AuthStore {
  // State
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  // Setters
  setUser: (user: IUser | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;

  // Token management
  setTokens: (tokens: IAuthTokens | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  hasToken: () => boolean;

  // Auth actions
  login: (user: IUser, tokens: IAuthTokens) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      accessToken: null,
      refreshToken: null,

      // Basic setters
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setIsInitialized: (isInitialized) => set({ isInitialized }),

      // Token management
      setTokens: (tokens) =>
        set({
          accessToken: tokens?.accessToken ?? null,
          refreshToken: tokens?.refreshToken ?? null,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      hasToken: () => {
        const state = get();
        return !!(state.accessToken || state.refreshToken);
      },

      // Auth actions
      login: (user, tokens) =>
        set({
          user,
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isInitialized: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "authStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
