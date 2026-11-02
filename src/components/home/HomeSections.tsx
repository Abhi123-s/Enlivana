"use client";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { artforms, artists, artworks, collections, priceBands, testimonials } from "@/data/catalog";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";

const trust = [
  ["Handmade", "Every piece made by an artist"],
  ["Worldwide shipping", "Customs handled for you"],
  ["Certificate", "Authenticity with every order"],
  ["Secure checkout", "UPI, cards and EMI"],
  ["Safe packaging", "Crated for fragile works"],
  ["Fair pricing", "Artists paid within 15 days"],
];

export function TrustStrip() {
  return (
    <Reveal className="border-b border-line">
      <ul className="container-x grid grid-cols-2 divide-x divide-line md:grid-cols-3 lg:grid-cols-6">
        {trust.map(([t, d]) => (
          <li key={t} data-reveal className="border-b border-line px-4 py-6 text-center lg:border-b-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-plum-deep">{t}</p>
            <p className="mt-1.5 text-xs text-muted">{d}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function ArtformTiles() {
  return (
    <Reveal className="container-x pt-20">
      <SectionHeading eyebrow="Shop by tradition" title="Explore artforms" action="All collections" href="/collections" />
      <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {artforms.map((f) => {
          const sample = artworks.find((a) => a.artform === f.name)!;
          return (
            <Link key={f.name} data-reveal href={`/collections?artform=${encodeURIComponent(f.name)}`} className="group bg-white p-4">
              <div className="aspect-square overflow-hidden bg-sand">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <ArtPlaceholder art={sample} />
                </div>
              </div>
              <p className="font-display mt-3 text-xl">{f.name}</p>
              <p className="text-xs text-muted">{f.state}</p>
              <p className="mt-1 hidden text-xs text-muted md:block">{f.blurb}</p>
            </Link>
          );
        })}
      </div>
    </Reveal>
  );
}

export function FeaturedGrid() {
  const list = artworks.filter((a) => !a.soldOut && (a.collections.includes("bestsellers") || a.badge)).slice(0, 8);
  return (
    <Reveal className="container-x pt-20">
      <SectionHeading eyebrow="Curated for you" title="Featured artworks" action="View all" href="/collections" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
        {list.map((a) => (
          <ProductCard key={a.handle} art={a} />
        ))}
      </div>
    </Reveal>
  );
}

export function CollectionBand() {
  return (
    <Reveal className="mt-20 border-y border-line bg-sand/60 py-16">
      <div className="container-x">
        <SectionHeading eyebrow="Exhibitions & themes" title="Curated collections" />
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} data-reveal href={`/collections?collection=${c.slug}`} className="group relative flex h-44 flex-col justify-end overflow-hidden border border-ink/10 bg-white p-5">
              <div className="absolute inset-y-0 right-0 w-1/3 transition-all duration-700 group-hover:w-1/2">
                <ArtPlaceholder art={{ palette: c.palette, motif: "mandala", handle: `col-${c.slug}` }} />
              </div>
              <p className="eyebrow relative">Collection</p>
              <p className="font-display relative mt-1 text-3xl">{c.title}</p>
              <p className="relative text-xs text-muted">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function ArtistFeature() {
  const artist = artists[0];
  const works = artworks.filter((a) => a.artistSlug === artist.slug).slice(0, 4);
  return (
    <Reveal className="container-x pt-20">
      <div id="artists" className="grid scroll-mt-32 gap-10 border-y border-ink py-12 lg:grid-cols-[1fr_1.4fr]">
        <div data-reveal>
          <p className="eyebrow">Featured artist</p>
          <h2 className="font-display mt-3 text-5xl">{artist.name}</h2>
          <p className="mt-1 text-sm text-plum">{artist.artform} · {artist.state}</p>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            {artist.bio} Working with Enlivana since {artist.joined}, her paintings hang in homes across 14 countries.
          </p>
          <Link href={`/collections?artist=${artist.slug}`} className="btn-outline mt-7">View her works</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {works.map((w) => (
            <Link data-reveal key={w.handle} href={`/products/${w.handle}`} className="group">
              <div className="aspect-[3/4] overflow-hidden">
                <div className="h-full transition-transform duration-700 group-hover:scale-105">
                  <ArtPlaceholder art={w} />
                </div>
              </div>
              <p className="font-display mt-2 text-lg">{w.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function PriceChips() {
  return (
    <Reveal className="container-x pt-20">
      <SectionHeading eyebrow="Budget" title="Shop by price" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {priceBands.map((b) => (
          <Link
            key={b.label}
            data-reveal
            href={`/collections?min=${b.min}${b.max !== Infinity ? `&max=${b.max}` : ""}`}
            className="group flex h-24 items-center justify-between border border-line bg-white px-5 transition hover:border-plum hover:bg-sand"
          >
            <span className="font-display text-xl">{b.label}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

export function Advisory() {
  return (
    <Reveal className="container-x pt-20">
      <div id="advisory" className="grid scroll-mt-32 gap-8 bg-plum-deep p-8 text-white md:grid-cols-[1.3fr_1fr] md:p-14">
        <div data-reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">Free art advisory</p>
          <h2 className="font-display mt-3 text-4xl md:text-5xl">Not sure what suits your wall?</h2>
          <p className="mt-4 max-w-lg text-white/75">Book a free 20-minute consultation. Our advisors recommend sizes, palettes and artforms for your space.</p>
        </div>
        <div data-reveal className="flex items-end md:justify-end">
          <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="inline-flex h-[54px] items-center bg-gold px-8 text-sm font-bold uppercase tracking-widest text-ink transition hover:bg-white">
            Book a consultation
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]", ref.current);
      nums.forEach((el) => {
        const target = Number(el.dataset.count);
        if (prefersReducedMotion()) {
          el.textContent = target.toLocaleString("en-IN");
          return;
        }
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(o, {
              v: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(o.v).toLocaleString("en-IN");
              },
            }),
        });
      });
    },
    { scope: ref },
  );
  const stats: [number, string, string][] = [
    [268, "", "Verified artists"],
    [143, "", "Artforms"],
    [12000, "+", "Artworks delivered"],
    [40, "+", "Countries shipped"],
  ];
  return (
    <div id="about" ref={ref} className="container-x scroll-mt-32 pt-20">
      <div className="grid grid-cols-2 divide-x divide-line border border-line md:grid-cols-4">
        {stats.map(([n, suffix, label]) => (
          <div key={label} className="border-b border-line px-4 py-9 text-center md:border-b-0">
            <p className="font-display text-5xl text-plum-deep">
              <span data-count={n}>0</span>
              {suffix}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <Reveal className="container-x pt-20">
      <SectionHeading eyebrow="Collectors say" title="Loved by art lovers" />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote key={t.name} data-reveal className="border border-line p-7">
            <p className="font-display text-6xl leading-none text-gold">“</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{t.text}</p>
            <footer className="mt-6 border-t border-line pt-4 text-xs uppercase tracking-widest text-muted">
              {t.name} · {t.city}
            </footer>
          </blockquote>
        ))}
      </div>
    </Reveal>
  );
}
