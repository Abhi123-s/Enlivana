"use client";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useCart, summarize } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Price } from "@/components/ui/Price";
import { FREE_SHIPPING_ABOVE, GIFT_WRAP_PRICE } from "@/lib/format";

export function CartDrawer() {
  const state = useCart();
  const hydrated = useHydrated();
  const { drawerOpen: open, closeDrawer: close } = state;
  const { items, subtotal, count } = summarize(hydrated ? state : { lines: [], giftWrap: false, promo: null });
  const ref = useRef<HTMLElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  const mounted = useRef(false);

  useGSAP(
    () => {
      // Let GSAP own the transform (no inline CSS transform, which it would misread as pixels).
      const to = { xPercent: open ? 0 : 100, autoAlpha: open ? 1 : 0 };
      if (!mounted.current) {
        gsap.set(ref.current, to);
        mounted.current = true;
      } else {
        gsap.to(ref.current, { ...to, duration: 0.5, ease: "power3.out" });
      }
      gsap.to(veil.current, { autoAlpha: open ? 1 : 0, duration: 0.35 });
      document.body.style.overflow = open ? "hidden" : "";
    },
    { dependencies: [open] },
  );

  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  return (
    <>
      <div ref={veil} onClick={close} className="invisible fixed inset-0 z-50 bg-ink/40 opacity-0" />
      <aside
        ref={ref}
        aria-hidden={!open}
        aria-label="Shopping cart"
        className="invisible fixed inset-y-0 right-0 z-[60] flex w-[380px] max-w-full flex-col bg-white shadow-2xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <p className="font-display text-2xl">
            Your cart <span className="text-sm text-muted">({count})</span>
          </p>
          <button onClick={close} aria-label="Close cart" className="text-2xl leading-none">×</button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-line px-5 py-3 text-xs">
            <p>
              {remaining > 0 ? (
                <>Add <Price inr={remaining} className="font-semibold" /> more for free shipping</>
              ) : (
                "You have unlocked free shipping"
              )}
            </p>
            <div className="mt-2 h-[3px] bg-line">
              <div className="h-full bg-plum transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-display text-3xl">Your cart is empty</p>
                <p className="mt-2 text-sm text-muted">Discover handmade art from across India.</p>
                <Link href="/collections" onClick={close} className="btn-primary mt-6">Browse collections</Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map(({ art, qty }) => (
                <li key={art.handle} className="flex gap-4 py-5">
                  <div className="h-24 w-[72px] shrink-0 overflow-hidden">
                    <ArtPlaceholder art={art} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/products/${art.handle}`} onClick={close} className="font-display truncate text-lg">{art.title}</Link>
                    <p className="text-xs text-muted">{art.artform}</p>
                    <Price inr={art.price} className="mt-1 text-sm font-semibold" />
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-line text-sm">
                        <button className="px-2.5 py-1" aria-label="Decrease quantity" onClick={() => state.setQty(art.handle, qty - 1)}>−</button>
                        <span className="w-6 text-center">{qty}</span>
                        <button className="px-2.5 py-1" aria-label="Increase quantity" onClick={() => state.setQty(art.handle, qty + 1)}>+</button>
                      </div>
                      <button className="text-xs text-muted underline" onClick={() => state.remove(art.handle)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line p-5">
            <label className="mb-4 flex cursor-pointer items-center gap-3 bg-sand px-3 py-2.5 text-xs">
              <input type="checkbox" checked={state.giftWrap} onChange={state.toggleGift} className="accent-plum" />
              <span>Add gift wrap and handwritten note · <Price inr={GIFT_WRAP_PRICE} className="font-semibold" /></span>
            </label>
            <div className="mb-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <Price inr={subtotal + (state.giftWrap ? GIFT_WRAP_PRICE : 0)} className="font-semibold" />
            </div>
            <Link href="/cart" onClick={close} className="btn-primary w-full">View cart and checkout</Link>
          </div>
        )}
      </aside>
    </>
  );
}
