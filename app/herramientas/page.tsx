import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/PageShell";
import { products } from "@/lib/site";

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Calculá, diagnosticá y prepará mejores decisiones con las tres herramientas del ecosistema Growtella.",
};

const icons = ["⌁", "◎", "✦"];

export default function ToolsPage() {
  return (
    <PageShell eyebrow="Catálogo Growtella" title="Tres herramientas. Una decisión más clara." description="Cada herramienta tiene un propósito concreto, un precio visible y la misma experiencia simple para que puedas pasar de la duda a la acción.">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {products.map((product, index) => (
            <article key={product.name} className={`card-hover flex min-h-[470px] flex-col rounded-[1.75rem] border p-7 sm:p-8 ${index === 0 ? "border-[#bcd7c6] bg-[#f5faf7]" : "border-[#dbe7df] bg-white"}`}>
              <div className="flex items-start justify-between gap-4">
                <span className={`grid size-14 place-items-center rounded-2xl text-2xl ${index === 0 ? "bg-[#153f2e] text-white" : "bg-[#e9f7ee] text-[#286f4d]"}`}>{icons[index]}</span>
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] ${product.status === "available" ? "bg-[#dff4e7] text-[#216e49]" : "bg-[#f2f5df] text-[#70782d]"}`}>{product.status === "available" ? "Disponible" : "Próximamente"}</span>
              </div>
              <p className="mt-7 text-[10px] font-black uppercase tracking-[.15em] text-[#71837b]">{product.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#153f2e]">{product.name}</h2>
              <p className="mt-4 min-h-20 text-sm leading-6 text-[#5b6f66]">{product.description}</p>

              {product.status === "available" ? <div className="mt-5 border-y border-[#e0ebe4] py-5"><p className="text-2xl font-black tracking-tight text-[#153f2e]">{product.price}</p><p className="mt-1 text-xs font-bold text-[#71837b]">{product.priceDetail}</p></div> : <div className="mt-5 border-y border-[#e7ebd6] bg-[#fafbf3] py-5"><p className="text-xl font-black text-[#687228]">Próximamente</p><p className="mt-1 text-xs font-bold text-[#7c8460]">Todavía no está habilitada</p></div>}

              <ul className="mt-5 grid flex-1 gap-3 text-sm text-[#4f655b]">
                {product.features.map((feature) => <li key={feature} className="flex gap-3"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#dff4e7] text-[10px] font-black text-[#1c6b45]">✓</span>{feature}</li>)}
              </ul>

              {product.status === "available" ? (
                product.external ? <a href={product.href} className="mt-8 inline-flex items-center justify-center rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Abrir herramienta →</a> : <Link href={product.href} className="mt-8 inline-flex items-center justify-center rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Probar ahora →</Link>
              ) : <span aria-disabled="true" className="mt-8 inline-flex cursor-not-allowed justify-center rounded-full border border-[#dfe3c9] bg-[#f8f9f1] px-5 py-3 text-sm font-black text-[#777d4d]">Próximamente · no disponible</span>}
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 rounded-[2rem] border border-[#bed7c8] bg-[#eff8f2] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">No sabés por cuál empezar</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-[#153f2e]">El diagnóstico te recomienda una prioridad.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#5b6f66]">Evaluá 15 indicadores, sumá tus números y recibí un plan de acción de 30 días. Es gratis y no requiere cuenta.</p>
          </div>
          <Link href="/diagnostico" className="inline-flex justify-center rounded-full bg-[#153f2e] px-6 py-3.5 text-sm font-black text-white hover:bg-[#0d3223]">Hacer diagnóstico →</Link>
        </div>
      </section>
    </PageShell>
  );
}
