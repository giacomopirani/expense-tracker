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
  isLoading: boolean; // ← Nuovo stato
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
  isLoading: true, // ← Inizia come loading

  hydrate: () => {
    try {
      const session = AuthService.getSession();

      if (session) {
        set({
          user: session.user,
          token: session.token,
          isLoading: false, // ← Fine loading
        });
      } else {
        set({
          user: null,
          token: null,
          isLoading: false, // ← Fine loading
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isLoading: false, // ← Fine loading anche in caso di errore
      });
    }
  },

  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    await AuthService.register(firstName, lastName, email, password);
    return true;
  },

  login: async (email, password) => {
    try {
      const session = await AuthService.login(email, password);

      set({
        user: session.user,
        token: session.token,
        isLoading: false,
      });
      return true;
    } catch (error) {
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
