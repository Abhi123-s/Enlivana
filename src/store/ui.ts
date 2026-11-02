"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/format";

interface UIState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  menuOpen: boolean;
  setMenu: (v: boolean) => void;
  toast: { id: number; message: string } | null;
  notify: (message: string) => void;
  dismissToast: () => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      currency: "INR",
      setCurrency: (currency) => set({ currency }),
      menuOpen: false,
      setMenu: (menuOpen) => set({ menuOpen }),
      toast: null,
      notify: (message) => set({ toast: { id: Date.now(), message } }),
      dismissToast: () => set({ toast: null }),
    }),
    { name: "enlivana-ui", partialize: (s) => ({ currency: s.currency }) },
  ),
);
