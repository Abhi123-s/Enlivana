export function ChatBubble() {
  return (
    <a
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-30 hidden items-center gap-2 border border-ink bg-white px-4 py-3 text-xs font-semibold uppercase tracking-widest shadow-lg transition hover:bg-plum-deep hover:text-white sm:flex lg:bottom-5 lg:right-5"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Talk to an art expert
    </a>
  );
}
