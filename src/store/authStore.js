import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: ({ user, accessToken, refreshToken }) =>
    set({ user, accessToken, refreshToken }),

  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
