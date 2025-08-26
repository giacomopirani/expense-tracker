import { create } from "zustand";
import { AuthService } from "../lib/services/auth-service";

type User = { id: string; email: string };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  hydrate: () => {
    const session = AuthService.getSession();
    if (session) set({ user: session.user, token: session.token });
  },

  register: async (email, password) => {
    await AuthService.register(email, password);
    return true;
  },

  login: async (email, password) => {
    const session = await AuthService.login(email, password);
    set({ user: session.user, token: session.token });
    return true;
  },

  logout: () => {
    AuthService.logout();
    set({ user: null, token: null });
  },
}));
