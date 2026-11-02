"use client";
import Link from "next/link";
import { getArtist, type Artwork } from "@/data/catalog";
import { savePercent } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/useHydrated";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Price } from "@/components/ui/Price";

export function VerifiedTick() {
  return (
    <svg viewBox="0 0 20 20" className="inline h-3.5 w-3.5 text-plum" aria-label="Verified artist">
      <path fill="currentColor" d="M10 1l2.4 1.7 2.9-.2 1 2.7 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-1 2.7-2.9-.2L10 19l-2.4-1.7-2.9.2-1-2.7L1.3 13l.9-2.8-.9-2.8 2.4-1.7 1-2.7 2.9.2z" />
      <path fill="none" stroke="#fff" strokeWidth="1.6" d="M6.5 10.2l2.4 2.3 4.6-4.6" />
    </svg>
  );
}

export function ProductCard({ art, reveal = true }: { art: Artwork; reveal?: boolean }) {
  const artist = getArtist(art.artistSlug);
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.handles.includes(art.handle));
  const toggle = useWishlist((s) => s.toggle);
  const notify = useUI((s) => s.notify);
  const hydrated = useHydrated();
  const save = savePercent(art.price, art.compareAt);
  const isWished = hydrated && wished;

  return (
    <article {...(reveal ? { "data-reveal": "" } : {})} className="group relative flex flex-col">
      <Link href={`/products/${art.handle}`} className="relative block aspect-[3/4] overflow-hidden bg-sand" aria-label={art.title}>
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
          <ArtPlaceholder art={art} />
        </div>
        <span className="absolute left-0 top-3 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
          {art.fulfilment === "ready-to-ship" ? "Ready to Ship" : "Made to Order"}
        </span>
        {art.soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
            Sold out
          </span>
        )}
        {art.badge && !art.soldOut && (
          <span className="absolute bottom-3 left-3 bg-plum px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            {art.badge}
          </span>
        )}
      </Link>

      <button
        onClick={() => {
          toggle(art.handle);
          notify(wished ? "Removed from wishlist" : "Saved to wishlist");
        }}
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWished}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={isWished ? "#744379" : "none"} stroke={isWished ? "#744379" : "currentColor"} strokeWidth="1.6">
          <path d="M12 21s-7.5-4.6-9.5-9.2C1.3 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 3.8 2 .5-.9 1.8-2 3.8-2 3.2 0 4.9 3.1 3.7 6.3C19.5 16.4 12 21 12 21z" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col border-b border-line pb-4 pt-4">
        <p className="eyebrow">
          {art.artform} · {art.width}″ × {art.height}″
        </p>
        <Link href={`/products/${art.handle}`} className="font-display mt-1.5 line-clamp-1 text-xl text-ink hover:text-plum">
          {art.title}
        </Link>
        <p className="mt-0.5 text-[13px] text-muted">
          {artist.name} {artist.verified && <VerifiedTick />}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Price inr={art.price} className="text-[15px] font-semibold text-ink" />
          {art.compareAt && <Price inr={art.compareAt} className="text-[13px] text-muted line-through" />}
          {save > 0 && <span className="text-[11px] font-semibold text-emerald-700">Save {save}%</span>}
        </div>
        <button disabled={art.soldOut} onClick={() => add(art.handle)} className="btn-outline mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40">
          {art.soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
