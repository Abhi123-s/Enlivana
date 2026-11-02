"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useCart, summarize } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/useHydrated";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Price } from "@/components/ui/Price";
import { FREE_SHIPPING_ABOVE, GIFT_WRAP_PRICE, PROMO_CODES } from "@/lib/format";

export function CartPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useCart();
  const user = useAuth((s) => s.user);
  const notify = useUI((s) => s.notify);
  const [code, setCode] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const s = summarize(state);

  useGSAP(
    () => {
      if (!hydrated || prefersReducedMotion()) return;
      gsap.from("[data-in]", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" });
    },
    { scope: root, dependencies: [hydrated, placed] },
  );

  if (!hydrated) return <div ref={root} className="container-x min-h-[60vh] py-24 text-center text-muted">Loading cart…</div>;

  if (placed) {
    return (
      <div ref={root} className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <div data-in className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-plum text-2xl text-plum">✓</div>
          <h1 data-in className="font-display mt-6 text-4xl md:text-5xl">Thank you for your order</h1>
          <p data-in className="mt-3 text-muted">Order {placed} is confirmed. Updates and artist photos will arrive on WhatsApp.</p>
          <Link data-in href="/collections" className="btn-primary mt-8">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const apply = () => {
    if (state.applyPromo(code)) {
      notify("Promo code applied");
      setCode("");
    } else notify("That code is not valid");
  };

  return (
    <div ref={root} className="container-x py-10 md:py-14">
      <h1 data-in className="font-display border-b border-ink pb-5 text-4xl md:text-5xl">Your cart</h1>

      {s.items.length === 0 ? (
        <div data-in className="py-24 text-center">
          <p className="font-display text-3xl">Your cart is empty</p>
          <p className="mt-2 text-muted">Find something to love in our collections.</p>
          <Link href="/collections" className="btn-primary mt-8">Browse collections</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <ul data-in className="divide-y divide-line border-b border-line">
            {s.items.map(({ art, qty }) => (
              <li key={art.handle} className="flex gap-4 py-6 sm:gap-6">
                <Link href={`/products/${art.handle}`} className="block aspect-[3/4] w-24 shrink-0 overflow-hidden sm:w-32">
                  <ArtPlaceholder art={art} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/products/${art.handle}`} className="font-display block truncate text-xl">{art.title}</Link>
                      <p className="mt-1 text-xs text-muted">{art.artform} · {art.width}″ × {art.height}″</p>
                      <p className="mt-1 text-xs text-muted">{art.fulfilment === "ready-to-ship" ? "Ready to ship" : `Made to order · ${art.makingDays}`}</p>
                    </div>
                    <Price inr={art.price * qty} className="font-semibold" />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-line">
                      <button className="px-3 py-1.5" aria-label="Decrease quantity" onClick={() => state.setQty(art.handle, qty - 1)}>−</button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button className="px-3 py-1.5" aria-label="Increase quantity" onClick={() => state.setQty(art.handle, qty + 1)}>+</button>
                    </div>
                    <button className="text-xs text-muted underline hover:text-plum" onClick={() => state.remove(art.handle)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside data-in className="h-fit border border-ink p-6 lg:sticky lg:top-40">
            <p className="eyebrow border-b border-line pb-3">Order summary</p>
            <label className="mt-5 flex cursor-pointer items-center gap-3 bg-sand px-3 py-3 text-sm">
              <input type="checkbox" checked={state.giftWrap} onChange={state.toggleGift} className="accent-plum" />
              <span>Gift wrap + note · <Price inr={GIFT_WRAP_PRICE} className="font-semibold" /></span>
            </label>

            <div className="mt-5 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                placeholder="Promo code (try ART10)"
                className="min-w-0 flex-1 border border-line px-3 py-2.5 text-sm uppercase outline-none focus:border-plum"
                aria-label="Promo code"
              />
              <button onClick={apply} className="btn-outline px-4">Apply</button>
            </div>
            {state.promo && (
              <p className="mt-2 text-xs text-emerald-700">
                {state.promo} applied ({PROMO_CODES[state.promo] * 100}% off) · <button className="underline" onClick={state.clearPromo}>remove</button>
              </p>
            )}

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <Row label="Subtotal" inr={s.subtotal} />
              {s.gift > 0 && <Row label="Gift wrap" inr={s.gift} />}
              {s.discount > 0 && <Row label="Discount" inr={-s.discount} accent />}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>{s.shipping === 0 ? <span className="text-emerald-700">Free</span> : <Price inr={s.shipping} />}</dd>
              </div>
              {s.shipping > 0 && (
                <p className="text-xs text-muted">Free shipping above <Price inr={FREE_SHIPPING_ABOVE} />.</p>
              )}
              <div className="flex justify-between border-t border-ink pt-4 text-base font-semibold">
                <dt>Total</dt>
                <dd><Price inr={s.total} /></dd>
              </div>
            </dl>

            <button
              className="btn-primary mt-6 w-full"
              onClick={() => {
                if (!user) {
                  notify("Sign in to place your order");
                  router.push("/login?next=/cart");
                  return;
                }
                setPlaced(`#EN${Math.floor(10000 + Math.random() * 89999)}`);
                state.clear();
              }}
            >
              {user ? "Place order (demo)" : "Sign in to checkout"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">Demo only. No payment is taken.</p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, inr, accent }: { label: string; inr: number; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? "text-emerald-700" : ""}>
        {inr < 0 ? "− " : ""}
        <Price inr={Math.abs(inr)} />
      </dd>
    </div>
  );
}
