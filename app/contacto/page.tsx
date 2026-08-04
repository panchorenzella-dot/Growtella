import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto", description: "Contactate con el equipo de Growtella." };

export default function ContactPage() {
  return (
    <PageShell eyebrow="Estamos construyendo con vos" title="Ideas, dudas o algo que mejorar." description="Contanos qué herramienta necesitás o qué podríamos hacer más simple para tu negocio.">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <a href={`mailto:${siteConfig.email}?subject=Consulta%20desde%20Growtella`} className="card-hover rounded-3xl border border-[#d8e5dd] bg-white p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e8f6ed] text-xl">✉</span>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-[#153f2e]">Escribinos por correo</h2>
            <p className="mt-3 break-all leading-7 text-[#5b6f66]">{siteConfig.email}</p>
            <span className="mt-6 inline-flex text-sm font-black text-[#26734f]">Abrir correo →</span>
          </a>
          <div className="rounded-3xl border border-[#d8e5dd] bg-[#f5faf7] p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-xl shadow-sm">✦</span>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-[#153f2e]">Proponé una herramienta</h2>
            <p className="mt-3 leading-7 text-[#5b6f66]">Decinos qué tarea te hace perder tiempo, qué calculás a mano o qué documento necesitás crear seguido.</p>
            <p className="mt-6 text-sm font-black text-[#26734f]">Las mejores ideas pueden convertirse en la próxima aplicación.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
