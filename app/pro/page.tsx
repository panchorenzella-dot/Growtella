import type { Metadata } from "next";
import Link from "next/link";

import { GrowtellaPricing } from "@/components/GrowtellaPricing";
import { PageShell } from "@/components/PageShell";
import { PLAN_LIMITS } from "@/lib/plans";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Growtella Pro",
  description: "Una sola suscripción para desbloquear más IA y beneficios en todas las herramientas actuales y futuras de Growtella.",
  alternates: { canonical: "/pro" },
};

const proBenefits = [
  `${PLAN_LIMITS.pro.analysis} análisis con IA por mes`,
  `${PLAN_LIMITS.pro.chat} mensajes con IA por mes`,
  "Escenarios guardados sin límite",
  "Modelo de IA con mayor capacidad",
  "Beneficios en todas las aplicaciones de Growtella",
  "Acceso anticipado a herramientas nuevas",
  "Experiencia sin publicidad",
];

const comparisons = [
  ["Cuenta central", "Incluida", "Incluida"],
  ["Calculadora Emprendedora", "Funciones esenciales", "Funciones y exportaciones Pro"],
  ["Diagnóstico 360°", "Completo y sin registro", "Completo y sin registro"],
  ["Presupuestos Inteligentes", "Próximamente", "Próximamente"],
  ["Análisis con IA", "1 por semana", "30 por mes"],
  ["Mensajes con IA", "5 por día", "300 por mes"],
  ["Escenarios", "3 por día", "Ilimitados"],
  ["Nuevas aplicaciones", "Acceso gratuito", "Ventajas Pro incluidas"],
];

function Check() {
  return <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-[#9ce1b8] text-[11px] font-black text-[#153f2e]">✓</span>;
}

export default function ProPage() {
  const paypalMode = process.env.PAYPAL_ENV?.toLowerCase() === "sandbox" ? "sandbox" : "live";
  const directPayPalReady = Boolean(
    process.env.PAYPAL_CLIENT_ID
      && process.env.PAYPAL_CLIENT_SECRET
      && process.env.PAYPAL_PLAN_MONTHLY_ID
      && process.env.PAYPAL_PLAN_QUARTERLY_ID
      && process.env.PAYPAL_PLAN_ANNUAL_ID
      && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
  const paypalReady = directPayPalReady || Boolean(process.env.PAYMENT_GATEWAY_URL || siteConfig.calculatorUrl);

  return (
    <PageShell
      eyebrow="Una sola suscripción"
      title="Growtella Pro para todas tus herramientas."
      description="No pagás aplicación por aplicación. Tu cuenta reconoce Pro en la calculadora y en cada producto nuevo que se incorpore al ecosistema."
    >
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid items-stretch gap-6 lg:grid-cols-[.88fr_1.12fr]">
          <article className="flex flex-col rounded-[2rem] border border-[#dbe5df] bg-white p-7 sm:p-9">
            <p className="text-sm font-black text-[#60746a]">Plan Gratis</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-[#153f2e]">US$ 0</h2>
            <p className="mt-4 leading-7 text-[#63766d]">Una cuenta gratuita para usar las herramientas principales, guardar tu trabajo y conocer la IA de Growtella.</p>
            <ul className="mt-7 grid gap-4 text-sm text-[#4c6258]">
              {["Calculadoras esenciales", "Resultados instantáneos", "Créditos iniciales de IA", "Historial y perfil compartidos"].map((benefit) => (
                <li key={benefit} className="flex gap-3"><Check />{benefit}</li>
              ))}
            </ul>
            <a href={siteConfig.calculatorUrl} className="mt-auto pt-9"><span className="inline-flex rounded-full border border-[#c8d9cf] px-5 py-3 text-sm font-black text-[#153f2e] hover:bg-[#f4f9f6]">Empezar gratis</span></a>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] bg-[#153f2e] p-7 text-white shadow-2xl shadow-[#153f2e]/15 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border-[44px] border-white/[.045]" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#9ce1b8]">Growtella Pro</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-.04em]">Una cuenta. Todo Pro.</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/[.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] text-[#b4ebc9]">Más elegido</span>
            </div>
            <p className="relative mt-4 max-w-xl leading-7 text-white/68">El plan compartido para crecer con más capacidad, sin volver a comprar cada herramienta por separado.</p>
            <GrowtellaPricing paypalReady={paypalReady} paypalMode={paypalMode} />
            <ul className="relative mt-7 grid gap-3 border-t border-white/10 pt-7 text-sm text-white/82 sm:grid-cols-2">
              {proBenefits.map((benefit) => <li key={benefit} className="flex gap-3"><Check />{benefit}</li>)}
            </ul>
          </article>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-[#dbe7df] bg-white">
          <div className="border-b border-[#e1ebe4] bg-[#f4f9f6] p-7 sm:p-9">
            <p className="eyebrow">Comparación transparente</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-[#153f2e]">Sabés exactamente qué incluye.</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1.15fr_.85fr_1fr] border-b border-[#e5ede8] px-7 py-4 text-xs font-black uppercase tracking-[.1em] text-[#71837a] sm:px-9"><span>Beneficio</span><span>Gratis</span><span className="text-[#26734f]">Growtella Pro</span></div>
              {comparisons.map(([feature, free, pro]) => (
                <div key={feature} className="grid grid-cols-[1.15fr_.85fr_1fr] border-b border-[#edf2ee] px-7 py-4 text-sm last:border-0 sm:px-9"><span className="font-black text-[#294739]">{feature}</span><span className="text-[#6e8077]">{free}</span><span className="font-bold text-[#26734f]">{pro}</span></div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-8 rounded-[2rem] bg-[#eef7f1] p-7 sm:p-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Preguntas frecuentes</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">Antes de elegir</h2></div>
          <div className="divide-y divide-[#d5e5db] border-y border-[#d5e5db]">
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Pro funciona también en la calculadora?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">Sí. Usá el mismo email o la misma cuenta de Google y el plan se reconoce desde la base compartida.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Las próximas herramientas están incluidas?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">La cuenta será la misma y cada herramienta nueva incluirá sus beneficios Pro sin obligarte a crear otra suscripción.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Cómo se aplican los descuentos?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">El plan trimestral ahorra 10% y el anual 20% frente a pagar todos los meses. PayPal muestra el total antes de confirmar.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Puedo cancelar?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">Sí. La suscripción se administra desde PayPal. Al cancelar, conservás Pro hasta finalizar el período ya pagado.</p></div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#667970]">¿Ya tenés una cuenta o un plan activo?</p>
          <Link href="/cuenta" className="mt-4 inline-flex rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Ver mi cuenta y mi plan</Link>
        </div>
      </section>
    </PageShell>
  );
}
