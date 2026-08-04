import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { products } from "@/lib/site";

export const metadata: Metadata = { title: "Herramientas", description: "Explorá las herramientas disponibles y próximas de Growtella." };

export default function ToolsPage() {
  return (
    <PageShell eyebrow="Catálogo Growtella" title="Una herramienta simple para cada decisión importante." description="Calculá, organizá y analizá tu negocio sin fórmulas complicadas ni aplicaciones desconectadas.">
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product, index) => (
            <article key={product.name} className="card-hover flex min-h-[350px] flex-col rounded-[1.75rem] border border-[#dbe7df] bg-white p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <span className={`grid size-14 place-items-center rounded-2xl text-2xl ${index === 0 ? "bg-[#153f2e] text-white" : "bg-[#e9f7ee] text-[#286f4d]"}`}>{index === 0 ? "⌁" : "✦"}</span>
                <span className="rounded-full bg-[#eff6f1] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-[#347556]">{product.status === "available" ? "Disponible" : "Próximamente"}</span>
              </div>
              <p className="mt-8 text-xs font-extrabold uppercase tracking-[.13em] text-[#71837b]">{product.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#153f2e]">{product.name}</h2>
              <p className="mt-4 flex-1 leading-7 text-[#5b6f66]">{product.description}</p>
              {product.status === "available" ? <a href={product.href} className="mt-8 inline-flex w-fit rounded-full bg-[#153f2e] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0d3223]">Abrir herramienta →</a> : <span className="mt-8 inline-flex w-fit rounded-full border border-[#d3e1d8] px-5 py-3 text-sm font-bold text-[#65776f]">En desarrollo</span>}
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-dashed border-[#b9d3c4] bg-[#f5faf7] p-8 text-center sm:p-12">
          <p className="text-sm font-black uppercase tracking-[.13em] text-[#3c7d5c]">El catálogo va a crecer con vos</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#153f2e]">Las próximas herramientas se elegirán escuchando a los usuarios.</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#5b6f66]">Preferimos pocas soluciones realmente útiles antes que llenar Growtella de funciones que nadie necesita.</p>
        </div>
      </section>
    </PageShell>
  );
}
