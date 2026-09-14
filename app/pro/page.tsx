import type { Metadata } from "next";
import Link from "next/link";

import { GrowtellaPricing } from "@/components/GrowtellaPricing";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Planes y precios",
  description: "Compará los planes Básico, Pro y Premium de Growtella y elegí la capacidad que necesita tu negocio.",
  alternates: { canonical: "/pro" },
};

const comparisons = [
  ["Calculadoras", "Gratuitas", "Precio, margen y punto de equilibrio", "Todas, incluidas las de rubro", "Todas + acceso anticipado"],
  ["Escenarios guardados", "Hasta 2", "Hasta 2", "Ilimitados", "Ilimitados"],
  ["Comparar escenarios", "No incluido", "No incluido", "Hasta 3 lado a lado", "Sin límite simultáneo"],
  ["Análisis con IA", "Cupo de prueba", "5 por mes", "50 por mes", "Ilimitados"],
  ["Soporte", "Ayuda general", "Email estándar", "Prioritario", "Prioritario + consulta 1 a 1"],
];

export default function ProPage() {
  const calculatorUrl = siteConfig.calculatorUrl.replace(/\/$/, "");
  const pricingUrl = `${calculatorUrl}/precios`;

  return (
    <PageShell
      eyebrow="Planes mensuales"
      title="Elegí la capacidad que necesita tu negocio hoy."
      description="Calculá gratis. Sumá guardado, comparación e IA cuando necesites convertir más alternativas en una decisión concreta."
    >
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[2rem] border border-[#cfe2d6] bg-[#eef7f1] p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="text-sm font-black text-[#397258]">Podés empezar sin pagar</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#153f2e]">Plan Gratis · US$ 0</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#5b6f66]">Usá las calculadoras gratuitas sin límite. La cuenta gratis permite guardar hasta 2 escenarios y probar la IA.</p>
          </div>
          <a href={`${calculatorUrl}/perfil?modo=registro`} className="inline-flex shrink-0 rounded-full border border-[#b9d3c3] bg-white px-5 py-3 text-sm font-black text-[#153f2e] hover:bg-[#f8fbf9]">
            Crear cuenta gratis
          </a>
        </div>

        <div className="mt-14 text-center">
          <p className="eyebrow">Planes pagos mensuales</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-[#153f2e] sm:text-4xl">Tres niveles claros, sin pago anual adelantado.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#63766d]">Los tres planes se renuevan mensualmente y se contratan desde la Calculadora Emprendedora con tu misma cuenta Growtella.</p>
        </div>

        <GrowtellaPricing pricingUrl={pricingUrl} />

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-[#dbe7df] bg-white">
          <div className="border-b border-[#e1ebe4] bg-[#f4f9f6] p-7 sm:p-9">
            <p className="eyebrow">Comparación transparente</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-[#153f2e]">Qué incluye cada plan.</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[1.15fr_repeat(4,1fr)] border-b border-[#e5ede8] px-7 py-4 text-xs font-black uppercase tracking-[.08em] text-[#71837a] sm:px-9">
                <span>Característica</span><span>Gratis</span><span>Básico</span><span className="text-[#26734f]">Pro · Recomendado</span><span>Premium</span>
              </div>
              {comparisons.map(([feature, free, basic, pro, premium]) => (
                <div key={feature} className="grid grid-cols-[1.15fr_repeat(4,1fr)] border-b border-[#edf2ee] px-7 py-4 text-sm last:border-0 sm:px-9">
                  <span className="font-black text-[#294739]">{feature}</span><span className="text-[#6e8077]">{free}</span><span className="text-[#6e8077]">{basic}</span><span className="font-bold text-[#26734f]">{pro}</span><span className="text-[#6e8077]">{premium}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-8 rounded-[2rem] bg-[#eef7f1] p-7 sm:p-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Preguntas frecuentes</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">Antes de elegir</h2></div>
          <div className="divide-y divide-[#d5e5db] border-y border-[#d5e5db]">
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Las calculadoras siguen siendo gratis?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">Sí. Podés usar las calculadoras gratuitas sin límite y sin cargar una tarjeta. Los planes pagos amplían guardado, comparación e IA.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Dónde contrato el plan?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">La contratación se completa en la Calculadora Emprendedora. Usá el mismo email o la misma cuenta de Google para conservar todo en tu cuenta Growtella.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Los planes son mensuales?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">Sí. Básico, Pro y Premium se renuevan mensualmente. PayPal muestra el importe final en USD antes de confirmar.</p></div>
            <div className="py-5"><h3 className="font-black text-[#294739]">¿Puedo cancelar?</h3><p className="mt-2 text-sm leading-6 text-[#62756b]">Sí. La suscripción se administra desde PayPal. Al cancelar, conservás los beneficios hasta finalizar el período ya pagado.</p></div>
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
