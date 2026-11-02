"use client";
import Link from "next/link";
import { artforms, collections } from "@/data/catalog";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.28em] text-plum-deep">ENLIVANA</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Handmade Indian art, bought directly from the artists who make it. Every piece ships with a certificate of authenticity.
          </p>
          <form className="mt-6 flex max-w-xs border border-ink/30 focus-within:border-plum" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Your email" className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" aria-label="Email for newsletter" />
            <button className="bg-plum-deep px-4 text-xs font-semibold uppercase tracking-widest text-white">Join</button>
          </form>
        </div>
        <FooterCol title="Collections" items={collections.map((c) => ({ label: c.title, href: `/collections?collection=${c.slug}` }))} />
        <FooterCol title="Artforms" items={artforms.slice(0, 6).map((a) => ({ label: a.name, href: `/collections?artform=${encodeURIComponent(a.name)}` }))} />
        <FooterCol
          title="Help"
          items={[
            { label: "Shipping & delivery", href: "/" },
            { label: "Returns & damage", href: "/" },
            { label: "Authenticity", href: "/" },
            { label: "Contact us", href: "/" },
          ]}
        />
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 pb-20 text-xs text-muted sm:flex-row lg:pb-5">
          <p>© {new Date().getFullYear()} Enlivana. Demo storefront with sample content.</p>
          <p className="tracking-wider">UPI · CARDS · NETBANKING · EMI · PAYPAL</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
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
