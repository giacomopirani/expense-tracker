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
    console.log("🔍 === HYDRATE START ===");
    try {
      const session = AuthService.getSession();
      console.log("Session trovata:", session);

      if (session) {
        console.log("✅ Hydrating con session");
        set({
          user: session.user,
          token: session.token,
          isLoading: false, // ← Fine loading
        });
      } else {
        console.log("❌ Nessuna session");
        set({
          user: null,
          token: null,
          isLoading: false, // ← Fine loading
        });
      }
    } catch (error) {
      console.error("❌ Errore hydrate:", error);
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
      console.log("✅ Login successful:", session);
      set({
        user: session.user,
        token: session.token,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  logout: () => {
    console.log("🔍 Logout chiamato");
    AuthService.logout();
    set({
      user: null,
      token: null,
      isLoading: false,
    });
  },
}));
