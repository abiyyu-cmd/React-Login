import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: ({ user, accessToken, refreshToken }) =>
    set({ user, accessToken, refreshToken }),

  updateUser: (user) => set({ user }),

  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
