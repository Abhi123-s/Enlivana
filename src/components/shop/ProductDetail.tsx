"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getArtist, type Artwork } from "@/data/catalog";
import { savePercent } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/useHydrated";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Price } from "@/components/ui/Price";
import { VerifiedTick } from "./ProductCard";

const altMotifs: Artwork["motif"][] = ["mandala", "sun", "waves"];

export function ProductDetail({ art }: { art: Artwork }) {
  const artist = getArtist(art.artistSlug);
  const root = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.handles.includes(art.handle));
  const notify = useUI((s) => s.notify);
  const hydrated = useHydrated();
  const save = savePercent(art.price, art.compareAt);
  const isWished = hydrated && wished;

  const views = [
    art,
    ...altMotifs.map((m, n) => ({
      ...art,
      handle: `${art.handle}-v${n}`,
      motif: m,
      palette: [art.palette[(n + 1) % 3], art.palette[n % 3], art.palette[2]] as Artwork["palette"],
    })),
  ];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-in]", { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
    },
    { scope: root },
  );

  const accordions = [
    ["About the artwork", art.description],
    ["Authenticity", "Each work is signed by the artist and ships with a certificate of authenticity emailed three to four days after delivery."],
    ["Sizes and framing", `${art.width}″ wide × ${art.height}″ high. Frames are not included; a framing guide is sent with your order.`],
    ["Shipping and taxes", "Free shipping across India above ₹1,999. International flat rate of ₹4,000; customs duties are paid by the buyer. Prices include GST."],
    ["Delivery and returns", "Report damage within 48 hours with photos for repair, replacement or store credit. Items in expected condition are not returnable."],
  ];

  return (
    <div ref={root} className="container-x py-8 pb-24 md:py-12 lg:pb-12">
      <nav className="mb-6 text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-plum">Home</Link> /{" "}
        <Link href="/collections" className="hover:text-plum">Collections</Link> /{" "}
        <Link href={`/collections?artform=${encodeURIComponent(art.artform)}`} className="hover:text-plum">{art.artform}</Link> /{" "}
        <span className="text-ink">{art.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-in className="grid gap-3 sm:grid-cols-[84px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {views.map((v, n) => (
              <button
                key={v.handle}
                onClick={() => setView(n)}
                aria-label={`View ${n + 1}`}
                className={`aspect-[3/4] w-16 overflow-hidden border sm:w-full ${view === n ? "border-plum" : "border-line opacity-70 hover:opacity-100"}`}
              >
                <ArtPlaceholder art={v} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setZoom((z) => !z)}
            className={`relative order-1 aspect-[3/4] overflow-hidden border border-line sm:order-2 ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            aria-label="Toggle zoom"
          >
            <div className={`h-full w-full transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}>
              <ArtPlaceholder art={views[view]} />
            </div>
            <span className="absolute left-0 top-4 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">Ships worldwide</span>
            <span className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 text-[10px] uppercase tracking-widest">Frames not included</span>
          </button>
        </div>

        <div>
          <p data-in className="eyebrow">{art.artform} · {art.state}</p>
          <h1 data-in className="font-display mt-2 text-5xl">{art.title}</h1>
          <p data-in className="mt-2 text-sm text-muted">
            by <Link href={`/collections?artist=${artist.slug}`} className="font-medium text-ink underline-offset-4 hover:underline">{artist.name}</Link>{" "}
            {artist.verified && <VerifiedTick />}
          </p>

          <div data-in className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-line py-5">
            <Price inr={art.price} className="text-3xl font-semibold" />
            {art.compareAt && <Price inr={art.compareAt} className="text-base text-muted line-through" />}
            {save > 0 && <span className="text-sm font-semibold text-emerald-700">Save {save}%</span>}
            <span className="w-full text-xs text-muted">Inclusive of GST. EMI from 3 months on select cards.</span>
          </div>

          <dl data-in className="mt-6 grid grid-cols-2 gap-px border border-line bg-line text-sm">
            {[
              ["Size", `${art.width}″ × ${art.height}″`],
              ["Medium", art.medium],
              ["Type", art.fulfilment === "ready-to-ship" ? "Ready to ship" : "Made to order"],
              ["Delivery", art.makingDays],
            ].map(([k, v]) => (
              <div key={k} className="bg-white p-3.5">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>

          <div data-in className="mt-6 flex gap-3">
            <button disabled={art.soldOut} onClick={() => add(art.handle)} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40">
              {art.soldOut ? "Sold out" : "Add to cart"}
            </button>
            <button
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => {
                toggle(art.handle);
                notify(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="grid h-[54px] w-[54px] place-items-center border border-ink/30 hover:border-plum"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill={isWished ? "#744379" : "none"} stroke={isWished ? "#744379" : "currentColor"} strokeWidth="1.6">
                <path d="M12 21s-7.5-4.6-9.5-9.2C1.3 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 3.8 2 .5-.9 1.8-2 3.8-2 3.2 0 4.9 3.1 3.7 6.3C19.5 16.4 12 21 12 21z" />
              </svg>
            </button>
          </div>
          <a data-in href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">
            Talk to our art expert
          </a>

          <ul data-in className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted">
            {["Handmade by the artist", "Colour may vary slightly", "Easy replacement if damaged", "Live WhatsApp order updates"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-plum" />
                {t}
              </li>
            ))}
          </ul>

          <div data-in className="mt-8 border-t border-ink">
            {accordions.map(([t, body], n) => (
              <div key={t} className="border-b border-line">
                <button onClick={() => setOpen(open === n ? null : n)} aria-expanded={open === n} className="flex w-full items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-[0.12em]">
                  {t} <span className="text-lg leading-none">{open === n ? "−" : "+"}</span>
                </button>
                <div className={`grid transition-all duration-300 ${open === n ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white p-3 lg:hidden">
        <div className="min-w-0">
          <p className="font-display truncate text-base">{art.title}</p>
          <Price inr={art.price} className="text-sm font-semibold" />
        </div>
        <button disabled={art.soldOut} onClick={() => add(art.handle)} className="btn-primary !h-11 shrink-0 px-6 disabled:opacity-40">
          {art.soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
