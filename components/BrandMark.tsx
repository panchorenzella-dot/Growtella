export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Growtella">
      <span className="grid size-9 place-items-center rounded-xl bg-[#153f2e] text-sm font-black text-white shadow-[0_7px_18px_rgba(21,63,46,.18)]">
        G
      </span>
      {!compact && (
        <span className="text-[1.08rem] font-extrabold tracking-[-0.035em] text-[#10291f]">
          Growtella
        </span>
      )}
    </span>
  );
}
