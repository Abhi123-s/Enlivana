"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishState {
  handles: string[];
  toggle: (h: string) => void;
}

export const useWishlist = create<WishState>()(
  persist(
    (set) => ({
      handles: [],
      toggle: (h) =>
        set((s) => ({ handles: s.handles.includes(h) ? s.handles.filter((x) => x !== h) : [...s.handles, h] })),
    }),
    { name: "enlivana-wishlist" },
  ),
);
