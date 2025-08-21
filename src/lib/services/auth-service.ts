import type { User } from "../../types/user";

export const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; token: string | null }> {
    // MOCK
    if (email === "test@test.com" && password === "1234") {
      const user: User = {
        id: "1",
        email,
        createdAt: new Date().toISOString(),
      };
      const token = "mock-jwt";
      localStorage.setItem("auth", JSON.stringify({ user, token }));
      return { user, token };
    }
    return { user: null, token: null };
  },

  async register(email: string, password: string): Promise<boolean> {
    // MOCK: finge di registrare
    return true;
  },

  logout() {
    localStorage.removeItem("auth");
  },

  getUser(): { user: User | null; token: string | null } {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { user: null, token: null };
  },
};
