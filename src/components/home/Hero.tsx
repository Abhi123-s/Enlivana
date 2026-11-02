"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { artworks, getArtist } from "@/data/catalog";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";

const slides = [
  { eyebrow: "New arrivals", title: "Art made by hand, bought from the artist", body: "Madhubani, Gond, Warli and more. Every work is signed, certified and shipped to your door.", cta: "Shop new arrivals", href: "/collections", art: "tree-of-life-madhubani", art2: "forest-spirit-gond" },
  { eyebrow: "Heritage classics", title: "Centuries of tradition, on your wall", body: "Pattachitra, Kerala murals and Thangka painted with natural and mineral pigments.", cta: "Explore heritage", href: "/collections?collection=heritage", art: "kerala-krishna-mural", art2: "sun-temple-pattachitra" },
  { eyebrow: "Gifting", title: "Small works, thoughtfully chosen", body: "Ready-to-ship pieces under ₹5,000, with gift wrap and a handwritten note.", cta: "Shop gifts", href: "/collections?collection=gifting", art: "dotted-deer-gond", art2: "lotus-offering-madhubani" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const first = useRef(true);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (first.current) {
        tl.from("[data-line]", { scaleX: 0, transformOrigin: "left", duration: 1.1 });
        first.current = false;
      }
      tl.fromTo("[data-copy] > *", { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 }, 0.1).fromTo(
        "[data-art]",
        { y: 50, autoAlpha: 0, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 1, stagger: 0.15 },
        0.2,
      );
    },
    { scope: root, dependencies: [i] },
  );

  // auto-advance
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const t = window.setTimeout(() => setI((n) => (n + 1) % slides.length), 7000);
      return () => window.clearTimeout(t);
    },
    { dependencies: [i] },
  );

  const go = (n: number) => setI((n + slides.length) % slides.length);
  const s = slides[i];
  const a1 = artworks.find((a) => a.handle === s.art)!;
  const a2 = artworks.find((a) => a.handle === s.art2)!;

  return (
    <section ref={root} className="relative overflow-hidden border-b border-line">
      <div data-line className="absolute left-0 right-0 top-0 h-px bg-ink/20" />
      <div className="container-x grid min-h-[560px] items-center gap-10 py-12 md:py-16 lg:min-h-[640px] lg:grid-cols-[1fr_1.1fr]">
        <div data-copy className="order-2 lg:order-1">
          <p className="eyebrow">{s.eyebrow}</p>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">{s.title}</h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">{s.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={s.href} className="btn-primary">{s.cta}</Link>
            <Link href="/#advisory" className="link-underline text-sm font-medium">Talk to an art advisor</Link>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <button aria-label="Previous slide" onClick={() => go(i - 1)} className="h-10 w-10 border border-ink/30 transition hover:bg-ink hover:text-white">←</button>
            <button aria-label="Next slide" onClick={() => go(i + 1)} className="h-10 w-10 border border-ink/30 transition hover:bg-ink hover:text-white">→</button>
            <div className="flex items-center gap-2">
              {slides.map((_, n) => (
                <button key={n} aria-label={`Slide ${n + 1}`} aria-current={n === i} onClick={() => setI(n)} className={`h-[3px] transition-all ${n === i ? "w-10 bg-plum" : "w-5 bg-ink/20"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 mx-auto grid w-full max-w-xl grid-cols-[1.15fr_1fr] items-end gap-4 lg:order-2 lg:max-w-none">
          <figure data-art className="aspect-[3/4] overflow-hidden border border-line bg-sand">
            <ArtPlaceholder art={a1} />
          </figure>
          <div className="flex flex-col gap-4">
            <figure data-art className="aspect-square overflow-hidden border border-line bg-sand">
              <ArtPlaceholder art={a2} />
            </figure>
            <figcaption data-art className="border-t border-ink pt-3 text-xs">
              <p className="font-display text-lg">{a1.title}</p>
              <p className="mt-1 text-muted">{getArtist(a1.artistSlug).name} · {a1.artform}</p>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}
