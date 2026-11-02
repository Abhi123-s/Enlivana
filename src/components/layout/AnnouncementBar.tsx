"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { announcements } from "@/data/catalog";

export function AnnouncementBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-msg]", ref.current);
      gsap.set(items, { yPercent: 100, autoAlpha: 0 });
      gsap.set(items[0], { yPercent: 0, autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      let i = 0;
      const timer = window.setInterval(() => {
        const cur = items[i];
        i = (i + 1) % items.length;
        gsap.to(cur, { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" });
        gsap.fromTo(items[i], { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.inOut" });
      }, 3800);
      return () => window.clearInterval(timer);
    },
    { scope: ref },
  );

  return (
    <div className="bg-plum-deep text-white">
      <div ref={ref} className="container-x relative h-9 overflow-hidden text-center text-[10px] font-medium uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]">
        {announcements.map((m) => (
          <p key={m} data-msg className="absolute inset-x-0 flex h-9 items-center justify-center px-3">
            {m}
          </p>
        ))}
      </div>
    </div>
  );
}
