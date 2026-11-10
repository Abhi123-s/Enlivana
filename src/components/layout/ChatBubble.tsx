export function ChatBubble() {
  return (
    <a
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Talk to an art expert"
      title="Talk to an art expert"
      className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-ink bg-white text-ink shadow-lg transition hover:bg-plum-deep hover:text-white lg:bottom-5 lg:right-5"
    >
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 20.5l1.7-5.3A8.4 8.4 0 1121 11.5z" />
      </svg>
      <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
    </a>
  );
}
