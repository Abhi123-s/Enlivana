"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { artworks } from "@/data/catalog";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const notify = useUI((s) => s.notify);
  const [mode, setMode] = useState<"signin" | "register">(params.get("mode") === "register" ? "register" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-in]", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" });
      gsap.from("[data-panel] > div", { scale: 1.08, autoAlpha: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" });
    },
    { scope: root },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (mode === "register" && name.trim().length < 2) err.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Enter a valid email address";
    if (password.length < 6) err.password = "Password must be at least 6 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    window.setTimeout(() => {
      login(email, mode === "register" ? name : undefined);
      notify(mode === "register" ? "Account created. Welcome!" : "Welcome back");
      const next = params.get("next");
      router.push(next && next.startsWith("/") ? next : "/");
    }, 700);
  };

  const art = artworks.filter((a) => ["tree-of-life-madhubani", "green-tara-thangka", "harvest-circle-warli"].includes(a.handle));

  return (
    <div ref={root} className="grid min-h-[calc(100vh-170px)] lg:grid-cols-2">
      <div data-panel className="relative hidden grid-cols-3 gap-px overflow-hidden border-r border-line bg-sand lg:grid">
        {art.map((a) => (
          <div key={a.handle} className="h-full">
            <ArtPlaceholder art={a} />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 border-t border-ink bg-white p-8">
          <p className="font-display text-4xl text-plum-deep">Art you can trust.</p>
          <p className="mt-2 max-w-sm text-sm text-muted">Save your wishlist, track made-to-order works and receive certificates of authenticity.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14">
        <form onSubmit={submit} noValidate className="w-full max-w-md">
          <p data-in className="eyebrow">{mode === "signin" ? "Welcome back" : "Join Enlivana"}</p>
          <h1 data-in className="font-display mt-2 text-5xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>

          <div data-in className="mt-8 grid grid-cols-2 border-b border-line text-sm font-medium uppercase tracking-widest" role="tablist">
            {(["signin", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                className={`-mb-px border-b-2 pb-3 ${mode === m ? "border-plum text-plum" : "border-transparent text-muted"}`}
              >
                {m === "signin" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {mode === "register" && <Field label="Full name" value={name} onChange={setName} error={errors.name} autoComplete="name" />}
            <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
            <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </div>

          <button data-in disabled={busy} className="btn-primary mt-8 w-full disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <p data-in className="mt-5 text-center text-xs text-muted">
            Demo: any valid email and a 6+ character password works. <Link href="/" className="text-plum underline">Back to home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; autoComplete?: string }) {
  return (
    <label data-in className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`mt-2 w-full border-b bg-transparent py-2.5 text-[15px] outline-none transition focus:border-plum ${error ? "border-red-600" : "border-ink/30"}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
