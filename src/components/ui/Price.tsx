"use client";
import { formatPrice } from "@/lib/format";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/useHydrated";

/** Renders a price in the selected display currency (INR until hydrated, to avoid a mismatch). */
export function Price({ inr, className = "" }: { inr: number; className?: string }) {
  const currency = useUI((s) => s.currency);
  const hydrated = useHydrated();
  return <span className={className}>{formatPrice(inr, hydrated ? currency : "INR")}</span>;
}
