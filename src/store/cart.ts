"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { artworks } from "@/data/catalog";
import { FLAT_SHIPPING, FREE_SHIPPING_ABOVE, GIFT_WRAP_PRICE, PROMO_CODES } from "@/lib/format";

interface Line {
  handle: string;
  qty: number;
}

interface CartState {
  lines: Line[];
  giftWrap: boolean;
  promo: string | null;
  drawerOpen: boolean;
  add: (handle: string) => void;
  setQty: (handle: string, qty: number) => void;
  remove: (handle: string) => void;
  toggleGift: () => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      giftWrap: false,
      promo: null,
      drawerOpen: false,
      add: (handle) =>
        set((s) => {
          const found = s.lines.find((l) => l.handle === handle);
          return {
            lines: found
              ? s.lines.map((l) => (l.handle === handle ? { ...l, qty: Math.min(l.qty + 1, 5) } : l))
              : [...s.lines, { handle, qty: 1 }],
            drawerOpen: true,
          };
        }),
      setQty: (handle, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.handle !== handle)
              : s.lines.map((l) => (l.handle === handle ? { ...l, qty: Math.min(qty, 5) } : l)),
        })),
      remove: (handle) => set((s) => ({ lines: s.lines.filter((l) => l.handle !== handle) })),
      toggleGift: () => set((s) => ({ giftWrap: !s.giftWrap })),
      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (!(c in PROMO_CODES)) return false;
        set({ promo: c });
        return true;
      },
      clearPromo: () => set({ promo: null }),
      clear: () => set({ lines: [], giftWrap: false, promo: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "enlivana-cart",
      partialize: (s) => ({ lines: s.lines, giftWrap: s.giftWrap, promo: s.promo }),
    },
  ),
);

export function summarize(s: Pick<CartState, "lines" | "giftWrap" | "promo">) {
  const items = s.lines
    .map((l) => ({ ...l, art: artworks.find((a) => a.handle === l.handle)! }))
    .filter((l) => l.art);
  const count = items.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((n, l) => n + l.art.price * l.qty, 0);
  const gift = s.giftWrap && items.length ? GIFT_WRAP_PRICE : 0;
  const discount = s.promo ? Math.round(subtotal * (PROMO_CODES[s.promo] ?? 0)) : 0;
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_ABOVE ? 0 : FLAT_SHIPPING;
  const total = subtotal + gift + shipping - discount;
  return { items, count, subtotal, gift, discount, shipping, total };
}
