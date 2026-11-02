import Link from "next/link";

export function SectionHeading({ eyebrow, title, action, href }: { eyebrow: string; title: string; action?: string; href?: string }) {
  return (
    <div data-reveal className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">{title}</h2>
      </div>
      {action && href && (
        <Link href={href} className="link-underline hidden shrink-0 text-sm font-medium text-plum sm:inline">
          {action} →
        </Link>
      )}
    </div>
  );
}
