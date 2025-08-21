import { create } from "zustand";
import { AuthService } from "../lib/services/auth-service";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    const { user, token } = await AuthService.login(email, password);
    if (user && token) {
      set({ user, token });
      return true;
    }
    return false;
  },

  register: async (email, password) => {
    const success = await AuthService.register(email, password);
    return success;
  },

  logout: () => {
    AuthService.logout();
    set({ user: null, token: null });
  },

  checkAuth: () => {
    const { user, token } = AuthService.getUser();
    set({ user, token });
  },
}));
