import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Mi cuenta", description: "Acceso central a tu cuenta y herramientas de Growtella." };

export default function AccountPage() {
  return (
    <PageShell eyebrow="Tu espacio personal" title="Una cuenta para todo Growtella." description="La cuenta central reunirá tu plan, créditos, historial y acceso a todas las herramientas.">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-[#d4e4da] bg-white shadow-xl shadow-[#153f2e]/7">
          <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_.85fr] md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-[#e8f6ed] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] text-[#28734e]">Integración en preparación</span>
              <h2 className="mt-5 text-3xl font-black tracking-[-.04em] text-[#153f2e]">Tu cuenta actual seguirá funcionando.</h2>
              <p className="mt-4 leading-7 text-[#5b6f66]">Si ya te registraste en Calculadora Emprendedora, esa misma identidad se convertirá en tu cuenta Growtella. No perderás escenarios, análisis ni beneficios.</p>
              <a href={`${siteConfig.calculatorUrl}/perfil`} className="mt-7 inline-flex rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Entrar a mi cuenta actual →</a>
            </div>
            <div className="rounded-3xl bg-[#f2f8f4] p-6">
              <p className="text-xs font-black uppercase tracking-[.13em] text-[#618074]">Próximamente acá</p>
              <div className="mt-5 grid gap-3">
                {['Plan y renovación','Créditos de IA','Historial compartido','Aplicaciones disponibles'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold text-[#395348] shadow-sm"><span className="grid size-7 place-items-center rounded-lg bg-[#e0f2e7] text-[#317652]">✓</span>{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
