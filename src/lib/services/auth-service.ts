const AUTH_KEY = "user";

export const AuthService = {
  login(email: string, password: string): boolean {
    if (email && password) {
      const mockUser = { email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  getUser(): { email: string } | null {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },
};
