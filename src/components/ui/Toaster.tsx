"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useUI } from "@/store/ui";

export function Toaster() {
  const toast = useUI((s) => s.toast);
  const dismiss = useUI((s) => s.dismissToast);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast || !ref.current) return;
    const tl = gsap.timeline({ onComplete: dismiss });
    tl.fromTo(ref.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" }).to(ref.current, {
      y: 20,
      autoAlpha: 0,
      duration: 0.3,
      delay: 2,
    });
    return () => {
      tl.kill();
    };
  }, [toast, dismiss]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="invisible fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 bg-ink px-5 py-3 text-sm text-white opacity-0 shadow-lg lg:bottom-6"
    >
      {toast?.message}
    </div>
  );
}
