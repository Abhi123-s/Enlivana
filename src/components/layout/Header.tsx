"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { artforms, collections, rooms } from "@/data/catalog";
import { currencies, type Currency } from "@/lib/format";
import { useCart, summarize } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/useHydrated";

const links = [
  { label: "Shop", href: "/collections", mega: true },
  { label: "Collections", href: "/collections" },
  { label: "Artists", href: "/#artists" },
  { label: "Art Advisory", href: "/#advisory" },
  { label: "About", href: "/#about" },
];

const paths = {
  bag: "M5 8h14l-1 12H6L5 8zm4 0V6a3 3 0 016 0v2",
  heart: "M12 21s-7.5-4.6-9.5-9.2C1.3 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 3.8 2 .5-.9 1.8-2 3.8-2 3.2 0 4.9 3.1 3.7 6.3C19.5 16.4 12 21 12 21z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8c0-4 3.6-6 8-6s8 2 8 6",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zm9 3l-4.5-4.5",
};

function Svg({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function Header() {
  const router = useRouter();
  const hydrated = useHydrated();
  const count = useCart((s) => summarize(s).count);
  const openCart = useCart((s) => s.openDrawer);
  const wishCount = useWishlist((s) => s.handles.length);
  const { user, logout } = useAuth();
  const { currency, setCurrency, menuOpen, setMenu, notify } = useUI();
  const [mega, setMega] = useState(false);
  const [acct, setAcct] = useState(false);
  const [q, setQ] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mounted = useRef(false);

  useGSAP(
    () => {
      if (!drawerRef.current) return;
      const to = { xPercent: menuOpen ? 0 : -100, autoAlpha: menuOpen ? 1 : 0 };
      if (!mounted.current) {
        gsap.set(drawerRef.current, to);
        mounted.current = true;
      } else {
        gsap.to(drawerRef.current, { ...to, duration: 0.45, ease: "power3.out" });
      }
      document.body.style.overflow = menuOpen ? "hidden" : "";
    },
    { dependencies: [menuOpen] },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/collections?q=${encodeURIComponent(q.trim())}`);
    setMenu(false);
  };

  return (
    <header className={`sticky top-0 z-40 bg-white transition-transform duration-300 ${hidden ? "-translate-y-full" : ""} ${scrolled ? "shadow-[0_1px_0_#e7e2da]" : ""}`}>
      <div className="border-b border-line">
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[72px]">
          <div className="flex items-center gap-3">
            <button className="-ml-1 p-1 lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
            <form onSubmit={submit} className="hidden items-center gap-2 border-b border-ink/30 pb-1 focus-within:border-plum lg:flex">
              <Svg d={paths.search} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search artworks, artists…" className="w-56 bg-transparent text-sm outline-none placeholder:text-muted" aria-label="Search" />
            </form>
          </div>

          <Link href="/" className="font-display text-center text-xl tracking-[0.28em] text-plum-deep sm:text-2xl md:text-3xl" aria-label="Enlivana home">
            ENLIVANA
          </Link>

          <div className="flex items-center justify-end gap-0.5 sm:gap-3">
            <label className="sr-only" htmlFor="cur">Currency</label>
            <select id="cur" value={hydrated ? currency : "INR"} onChange={(e) => setCurrency(e.target.value as Currency)} className="hidden cursor-pointer bg-transparent text-xs font-medium tracking-wider outline-none sm:block">
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            <div className="relative" onMouseLeave={() => setAcct(false)}>
              <button aria-label="Account" className="p-1.5 hover:text-plum" onClick={() => setAcct((v) => !v)} onMouseEnter={() => setAcct(true)}>
                <Svg d={paths.user} />
              </button>
              {acct && (
                <div className="absolute right-0 top-full z-50 w-56 border border-line bg-white py-2 shadow-xl">
                  {hydrated && user ? (
                    <>
                      <p className="px-4 pb-2 pt-1 text-xs text-muted">
                        Signed in as <span className="font-semibold capitalize text-ink">{user.name}</span>
                      </p>
                      <Link href="/collections?wishlist=1" className="menu-item" onClick={() => setAcct(false)}>My wishlist ({wishCount})</Link>
                      <button className="menu-item w-full text-left" onClick={() => { logout(); setAcct(false); notify("Signed out"); }}>
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="menu-item" onClick={() => setAcct(false)}>Sign in</Link>
                      <Link href="/login?mode=register" className="menu-item" onClick={() => setAcct(false)}>Create account</Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/collections?wishlist=1" aria-label="Wishlist" className="relative hidden p-1.5 hover:text-plum sm:block">
              <Svg d={paths.heart} />
              {hydrated && wishCount > 0 && <span className="badge-dot">{wishCount}</span>}
            </Link>
            <button aria-label="Open cart" onClick={openCart} className="relative p-1.5 hover:text-plum">
              <Svg d={paths.bag} />
              {hydrated && count > 0 && <span className="badge-dot">{count}</span>}
            </button>
          </div>
        </div>
      </div>

      <nav className="relative hidden border-b border-line bg-white lg:block" onMouseLeave={() => setMega(false)}>
        <ul className="container-x flex h-12 items-center justify-center gap-10 text-[12px] font-medium uppercase tracking-[0.2em]">
          {links.map((l) => (
            <li key={l.label} onMouseEnter={() => setMega(!!l.mega)}>
              <Link href={l.href} className="link-underline py-4">{l.label}</Link>
            </li>
          ))}
        </ul>
        {mega && (
          <div className="absolute inset-x-0 top-full border-b border-t border-line bg-white shadow-xl">
            <div className="container-x grid grid-cols-4 gap-10 py-8">
              <MegaCol title="Collections" items={collections.map((c) => ({ label: c.title, href: `/collections?collection=${c.slug}` }))} />
              <MegaCol title="Artforms" items={artforms.slice(0, 6).map((a) => ({ label: a.name, href: `/collections?artform=${encodeURIComponent(a.name)}` }))} />
              <MegaCol title="Rooms" items={rooms.map((r) => ({ label: r, href: `/collections?room=${encodeURIComponent(r)}` }))} />
              <MegaCol
                title="Budget"
                items={[
                  { label: "Under ₹5,000", href: "/collections?min=0&max=5000" },
                  { label: "₹5,000 – ₹10,000", href: "/collections?min=5000&max=10000" },
                  { label: "₹10,000 – ₹25,000", href: "/collections?min=10000&max=25000" },
                  { label: "Above ₹25,000", href: "/collections?min=25000" },
                ]}
              />
            </div>
          </div>
        )}
      </nav>

      {/* mobile drawer */}
      <div className={`fixed inset-0 z-50 bg-ink/40 transition-opacity ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setMenu(false)} />
      <div ref={drawerRef} className="invisible fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[86vw] flex-col bg-white" aria-hidden={!menuOpen}>
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="font-display text-xl tracking-[0.25em] text-plum-deep">ENLIVANA</span>
          <button aria-label="Close menu" onClick={() => setMenu(false)} className="text-2xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="m-5 flex items-center gap-2 border border-line px-3 py-2.5">
          <Svg d={paths.search} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search artworks" className="w-full bg-transparent text-sm outline-none" aria-label="Search artworks" />
        </form>
        <ul className="flex-1 overflow-y-auto px-5">
          {links.map((l) => (
            <li key={l.label} className="border-b border-line">
              <Link href={l.href} onClick={() => setMenu(false)} className="block py-4 text-sm font-medium uppercase tracking-[0.18em]">{l.label}</Link>
            </li>
          ))}
          {collections.slice(0, 4).map((c) => (
            <li key={c.slug}>
              <Link href={`/collections?collection=${c.slug}`} onClick={() => setMenu(false)} className="block py-2.5 pl-3 text-sm text-muted">{c.title}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line p-5 text-sm">
          <Link href="/login" onClick={() => setMenu(false)} className="font-medium capitalize text-plum">
            {hydrated && user ? `Hi, ${user.name}` : "Sign in"}
          </Link>
          <select value={hydrated ? currency : "INR"} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent" aria-label="Currency">
            {currencies.map((c) => (
              <option key={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

function MegaCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-4 border-b border-line pb-2">{title}</p>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="text-sm text-ink/80 hover:text-plum">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
