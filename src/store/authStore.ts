import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_USERS: (User & { password: string })[] = [
  { id: "u1", name: "Arjun Mehta", email: "arjun@resqnet.app", password: "demo123", role: "admin", createdAt: "2024-01-15T10:00:00Z" },
  { id: "u2", name: "Priya Sharma", email: "priya@resqnet.app", password: "demo123", role: "responder", createdAt: "2024-02-20T10:00:00Z" },
  { id: "u3", name: "Demo User", email: "demo@resqnet.app", password: "demo123", role: "user", createdAt: "2024-03-01T10:00:00Z" },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, password) => {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (name, email, password) => {
    if (DEMO_USERS.find((u) => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, name, email, role: "user", createdAt: new Date().toISOString() };
    DEMO_USERS.push({ ...newUser, password });
    set({ user: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
