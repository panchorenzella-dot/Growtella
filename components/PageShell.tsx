import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <main className="flex-1">
      <section className="border-b border-[#e1e9e4] bg-[linear-gradient(180deg,#f5faf7_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-.045em] text-[#10291f] sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5b6f66]">{description}</p>
        </div>
      </section>
      {children}
    </main>
  );
}
