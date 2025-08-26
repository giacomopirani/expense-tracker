import api from "../api/client";

export const AuthService = {
  async register(email: string, password: string) {
    await api.post("/auth/register", { email, password });
    return true;
  },

  async login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    // data: { user, token }
    localStorage.setItem("auth", JSON.stringify(data));
    return data as { user: { id: string; email: string }; token: string };
  },

  logout() {
    localStorage.removeItem("auth");
  },

  getSession() {
    const raw = localStorage.getItem("auth");
    return raw
      ? (JSON.parse(raw) as {
          user: { id: string; email: string };
          token: string;
        })
      : null;
  },
};
