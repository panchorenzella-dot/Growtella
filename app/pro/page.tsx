import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Growtella Pro", description: "Un plan para desbloquear beneficios en todas las herramientas de Growtella." };

const proBenefits = ["Más créditos de inteligencia artificial", "Historial y escenarios sin límites pequeños", "Exportaciones profesionales", "Beneficios en todas las aplicaciones", "Acceso anticipado a herramientas nuevas", "Experiencia sin publicidad"];

export default function ProPage() {
  return (
    <PageShell eyebrow="Una sola suscripción" title="Growtella Pro crece con cada herramienta." description="Pagá por la plataforma, no por cada aplicación. Todo lo que se sume a Growtella hace que tu plan tenga más valor.">
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[#dbe5df] bg-white p-8">
            <p className="text-sm font-black text-[#5d7067]">Gratis</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">Para empezar</h2>
            <p className="mt-4 leading-7 text-[#63766d]">Herramientas centrales y una cantidad inicial de usos de IA para conocer la plataforma.</p>
            <ul className="mt-8 grid gap-4 text-sm text-[#4c6258]">
              <li>✓ Calculadoras esenciales</li><li>✓ Resultados instantáneos</li><li>✓ Créditos iniciales de IA</li><li>✓ Cuenta personal</li>
            </ul>
            <a href={siteConfig.calculatorUrl} className="mt-9 inline-flex rounded-full border border-[#c8d9cf] px-5 py-3 text-sm font-black text-[#153f2e] hover:bg-[#f4f9f6]">Empezar gratis</a>
          </article>
          <article className="relative overflow-hidden rounded-[1.75rem] bg-[#153f2e] p-8 text-white shadow-2xl shadow-[#153f2e]/15">
            <div className="absolute -right-10 -top-16 size-48 rounded-full border-[35px] border-white/5" />
            <p className="relative text-sm font-black text-[#9ce1b8]">Growtella Pro</p>
            <h2 className="relative mt-3 text-3xl font-black tracking-tight">Una cuenta. Todo Pro.</h2>
            <p className="relative mt-4 leading-7 text-white/68">La membresía compartida para las herramientas actuales y futuras de Growtella.</p>
            <ul className="relative mt-8 grid gap-4 text-sm text-white/82">
              {proBenefits.map((benefit) => <li key={benefit} className="flex gap-3"><span className="font-black text-[#94deb2]">✓</span>{benefit}</li>)}
            </ul>
            <a href={`${siteConfig.calculatorUrl}/precios`} className="relative mt-9 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[#153f2e] hover:bg-[#eaf7ef]">Ver plan actual</a>
          </article>
        </div>
        <div className="mt-12 rounded-3xl bg-[#eef7f1] p-8 text-center sm:p-12">
          <p className="eyebrow">Próximo lanzamiento</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">Fundadores de Growtella</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#5b6f66]">La promoción se activará cuando la cuenta central y la segunda herramienta estén listas. No necesitás registrarte nuevamente si ya usás la calculadora.</p>
          <Link href="/contacto" className="mt-7 inline-flex rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white">Quiero recibir novedades</Link>
        </div>
      </section>
    </PageShell>
  );
}
