"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { artforms, artists, artworks, collections, priceBands, rooms } from "@/data/catalog";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/lib/useHydrated";
import { ProductCard } from "./ProductCard";

const sorts = [
  { v: "featured", l: "Featured" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "discount", l: "Biggest discount" },
];

export function CollectionView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.handles);
  const query = params.toString();

  const f = useMemo(() => {
    const p = new URLSearchParams(query);
    return {
      q: p.get("q")?.toLowerCase() ?? "",
      collection: p.get("collection"),
      artist: p.get("artist"),
      artform: p.getAll("artform"),
      room: p.getAll("room"),
      fulfilment: p.getAll("fulfilment"),
      min: Number(p.get("min") ?? 0),
      max: p.get("max") ? Number(p.get("max")) : Infinity,
      instock: p.get("instock") === "1",
      wishlist: p.get("wishlist") === "1",
      sort: p.get("sort") ?? "featured",
    };
  }, [query]);

  const results = useMemo(() => {
    const wl = hydrated ? wished : [];
    const disc = (a: (typeof artworks)[number]) => (a.compareAt ? (a.compareAt - a.price) / a.compareAt : 0);
    let r = artworks.filter((a) => {
      if (f.q && !`${a.title} ${a.artform} ${a.state} ${a.artistSlug.replace("-", " ")}`.toLowerCase().includes(f.q)) return false;
      if (f.collection && !a.collections.includes(f.collection)) return false;
      if (f.artist && a.artistSlug !== f.artist) return false;
      if (f.artform.length && !f.artform.includes(a.artform)) return false;
      if (f.room.length && !a.rooms.some((x) => f.room.includes(x))) return false;
      if (f.fulfilment.length && !f.fulfilment.includes(a.fulfilment)) return false;
      if (a.price < f.min || a.price > f.max) return false;
      if (f.instock && a.soldOut) return false;
      if (f.wishlist && !wl.includes(a.handle)) return false;
      return true;
    });
    if (f.sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (f.sort === "discount") r = [...r].sort((a, b) => disc(b) - disc(a));
    return r;
  }, [f, wished, hydrated]);

  const push = (p: URLSearchParams) => router.replace(p.size ? `${pathname}?${p.toString()}` : pathname, { scroll: false });
  const set = (key: string, value: string | null) => {
    const p = new URLSearchParams(query);
    if (value === null) p.delete(key);
    else p.set(key, value);
    push(p);
  };
  const toggleMulti = (key: string, value: string) => {
    const p = new URLSearchParams(query);
    const cur = p.getAll(key);
    p.delete(key);
    (cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]).forEach((v) => p.append(key, v));
    push(p);
  };
  const setPrice = (min: number, max: number) => {
    const p = new URLSearchParams(query);
    p.delete("min");
    p.delete("max");
    if (min > 0) p.set("min", String(min));
    if (max !== Infinity) p.set("max", String(max));
    push(p);
  };

  const collection = collections.find((c) => c.slug === f.collection);
  const artist = artists.find((a) => a.slug === f.artist);
  const active = [
    ...(collection ? [{ k: "collection", label: collection.title }] : []),
    ...(artist ? [{ k: "artist", label: artist.name }] : []),
    ...(f.q ? [{ k: "q", label: `“${f.q}”` }] : []),
    ...(f.wishlist ? [{ k: "wishlist", label: "Wishlist" }] : []),
  ];
  const title = collection?.title ?? (f.wishlist ? "Your wishlist" : artist ? artist.name : "All artworks");
  const blurb = collection?.blurb ?? "Handmade works, signed by the artists who made them.";

  useGSAP(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      gsap.fromTo(grid.current.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.04, ease: "power2.out", overwrite: true });
    },
    { scope: grid, dependencies: [query, hydrated] },
  );

  const filters = (
    <div className="space-y-8">
      <Group title="Artform">
        {artforms.map((a) => (
          <Check key={a.name} label={a.name} checked={f.artform.includes(a.name)} onChange={() => toggleMulti("artform", a.name)} />
        ))}
      </Group>
      <Group title="Price">
        {priceBands.map((b) => (
          <Check key={b.label} radio label={b.label} checked={f.min === b.min && f.max === b.max} onChange={() => setPrice(b.min, b.max)} />
        ))}
        <button className="mt-1 text-xs text-muted underline" onClick={() => setPrice(0, Infinity)}>Clear price</button>
      </Group>
      <Group title="Room">
        {rooms.map((r) => (
          <Check key={r} label={r} checked={f.room.includes(r)} onChange={() => toggleMulti("room", r)} />
        ))}
      </Group>
      <Group title="Delivery">
        <Check label="Ready to Ship" checked={f.fulfilment.includes("ready-to-ship")} onChange={() => toggleMulti("fulfilment", "ready-to-ship")} />
        <Check label="Made to Order" checked={f.fulfilment.includes("made-to-order")} onChange={() => toggleMulti("fulfilment", "made-to-order")} />
      </Group>
      <Group title="Availability">
        <Check label="In stock only" checked={f.instock} onChange={() => set("instock", f.instock ? null : "1")} />
      </Group>
    </div>
  );

  return (
    <>
      <div className="border-b border-line bg-sand/50">
        <div className="container-x py-10 md:py-14">
          <nav className="mb-4 text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-plum">Home</Link> / <span className="text-ink">{title}</span>
          </nav>
          <p className="eyebrow">Top collection</p>
          <h1 className="font-display mt-2 text-5xl md:text-6xl">{title}</h1>
          <p className="mt-3 max-w-xl text-muted">{blurb}</p>
        </div>
      </div>

      <div className="container-x grid gap-10 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <p className="eyebrow mb-5 border-b border-ink pb-3">Filters</p>
          {filters}
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
            <button onClick={() => setDrawer(true)} className="btn-outline lg:hidden">Filters</button>
            <p className="text-sm text-muted" aria-live="polite">{results.length} artworks</p>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Sort</span>
              <select value={f.sort} onChange={(e) => set("sort", e.target.value === "featured" ? null : e.target.value)} className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-plum">
                {sorts.map((s) => (
                  <option key={s.v} value={s.v}>{s.l}</option>
                ))}
              </select>
            </label>
          </div>

          {active.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {active.map((c) => (
                <button key={c.k} onClick={() => set(c.k, null)} className="flex items-center gap-2 bg-sand px-3 py-1.5 text-xs">
                  {c.label} <span aria-hidden>×</span>
                </button>
              ))}
              <button onClick={() => router.replace(pathname)} className="px-2 text-xs text-muted underline">Clear all</button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="border border-dashed border-line py-24 text-center">
              <p className="font-display text-3xl">No artworks match</p>
              <p className="mt-2 text-sm text-muted">Try removing a filter.</p>
              <button onClick={() => router.replace(pathname)} className="btn-primary mt-6">Reset filters</button>
            </div>
          ) : (
            <div ref={grid} className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3 xl:gap-x-7">
              {results.map((a) => (
                <ProductCard key={a.handle} art={a} reveal={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-ink/40 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-y-0 left-0 flex w-[320px] max-w-[88vw] flex-col bg-white transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <p className="font-display text-2xl">Filters</p>
            <button onClick={() => setDrawer(false)} aria-label="Close filters" className="text-2xl leading-none">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{filters}</div>
          <div className="border-t border-line p-5">
            <button onClick={() => setDrawer(false)} className="btn-primary w-full">Show {results.length} artworks</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em]">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function Check({ label, checked, onChange, radio }: { label: string; checked: boolean; onChange: () => void; radio?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/85 hover:text-plum">
      <input type={radio ? "radio" : "checkbox"} checked={checked} onChange={onChange} className="h-4 w-4 accent-plum" />
      {label}
    </label>
  );
}
