import Link from "next/link";

// Plain server component, same reasoning as the footer: nothing here
// animates or needs client state, so it costs nothing to keep static.
export default function NotFound() {
  return (
    <section className="paper-grain min-h-[70dvh] flex items-center justify-center bg-[#1e3a2f] text-[#f5f6f1] px-6 py-24">
      <div className="ticket-edge relative w-full max-w-[360px] rounded-[14px] bg-white text-[#17180f] shadow-[var(--shadow-brand)] overflow-hidden font-mono-ticket">
        <div className="bg-[#17180f] text-[#f5f6f1] px-4 py-2.5 flex items-center justify-between text-[11px] tracking-widest">
          <span>ORDER #404</span>
          <span className="text-[#cdf23e]">VOID</span>
        </div>

        <div className="px-5 pt-6 pb-6 flex flex-col items-center gap-4 text-center">
          <span className="text-[10px] tracking-[0.2em] text-[#1e3a2f] font-bold">
            KITCHEN NOTE
          </span>
          <h1 className="font-display text-[28px] leading-[1.05]">
            Nothing on this ticket.
          </h1>
          <p className="text-[13px] text-[#4a4e42] leading-relaxed max-w-[260px]">
            The page you&apos;re looking for isn&apos;t on the menu. It may have moved, or never existed.
          </p>

          <div className="w-full border-t border-dashed border-[#cbcdc2] my-1" />

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#cdf23e] text-[#17180f] text-[13px] font-bold px-6 py-2.5 transition-transform duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:-translate-y-0.5"
          >
            Back to the kitchen
          </Link>
        </div>
      </div>
    </section>
  );
}
