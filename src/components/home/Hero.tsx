"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const slides = [
  { eyebrow: "New arrivals", title: "Art by hand", cta: "Discover more", href: "/collections" },
  { eyebrow: "Heritage classics", title: "Timeless Traditions", cta: "Discover more", href: "/collections?collection=heritage" },
  { eyebrow: "Gifting", title: "Small works, great meaning", cta: "Discover more", href: "/collections?collection=gifting" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-copy] > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" });
    },
    { scope: root, dependencies: [i] },
  );

  // auto-advance copy
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const t = window.setTimeout(() => setI((n) => (n + 1) % slides.length), 7000);
      return () => window.clearTimeout(t);
    },
    { dependencies: [i] },
  );

  const s = slides[i];

  return (
    <section ref={root} className="relative h-[calc(100svh-64px)] min-h-[480px] overflow-hidden bg-ink text-white md:h-[calc(100svh-72px)]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-motoxchange-1080p.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-x-0 top-[52%] z-10 px-4 text-center">
        <div data-copy className="mx-auto flex max-w-3xl flex-col items-center">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/90">{s.eyebrow}</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">{s.title}</h1>
          <Link href={s.href} className="mt-6 inline-flex h-11 items-center rounded-full bg-neutral-500/60 px-8 text-[15px] font-semibold backdrop-blur-sm transition hover:bg-neutral-500/80">
            {s.cta}
          </Link>
        </div>
      </div>

      <a
        href="#discover"
        aria-label="Scroll down"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 p-2"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
