import { create } from "zustand";
import { AuthService } from "../lib/services/auth-service";

type User = {
  [x: string]: any;
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true, // parte come true

  hydrate: () => {
    set({ isLoading: true });
    try {
      // puoi anche rendere questo async se validi lato server
      const session = AuthService.getSession();

      if (session) {
        set({
          user: session.user,
          token: session.token,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  register: async (firstName, lastName, email, password) => {
    await AuthService.register(firstName, lastName, email, password);
    return true;
  },

  login: async (email, password) => {
    set({ isLoading: true }); // 👈 adesso parte il loader
    try {
      const session = await AuthService.login(email, password);

      set({
        user: session.user,
        token: session.token,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    AuthService.logout();
    set({
      user: null,
      token: null,
      isLoading: false,
    });
  },
}));
