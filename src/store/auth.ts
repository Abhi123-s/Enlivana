"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name) =>
        set({ user: { email, name: name?.trim() || email.split("@")[0].replace(/[._]/g, " ") } }),
      logout: () => set({ user: null }),
    }),
    { name: "enlivana-auth" },
  ),
);
