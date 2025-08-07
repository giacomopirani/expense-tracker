import { create } from "zustand";
import { AuthService } from "../lib/services/auth-service";

type User = { email: string };

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (email, password) => {
    const success = AuthService.login(email, password);
    if (success) set({ user: { email } });
    return success;
  },

  logout: () => {
    AuthService.logout();
    set({ user: null });
  },

  checkAuth: () => {
    const user = AuthService.getUser();
    set({ user });
  },
}));
