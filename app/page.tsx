import Link from "next/link";

import { BILLING_OPTIONS } from "@/lib/plans";
import { products, siteConfig } from "@/lib/site";

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-[#496057]">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#dff4e7] text-[10px] font-black text-[#1c6b45]">✓</span>
      <span>{children}</span>
    </li>
  );
}

function formatUsd(value: number) {
  return `US$ ${value.toLocaleString("es-AR", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

const productIcons = ["⌁", "◎", "✦"];

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative border-b border-[#dce9e1] bg-[#f6faf7]">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-75" />
        <div className="pointer-events-none absolute -left-32 top-16 size-96 rounded-full bg-[#bcebcf]/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8ded1] bg-white/90 px-3.5 py-2 text-xs font-black text-[#286847] shadow-sm">
              <span className="size-2 rounded-full bg-[#43ae76] shadow-[0_0_0_4px_#e1f3e8]" />
              El centro operativo para emprender mejor
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.96] tracking-[-.065em] text-[#0e2b1f] sm:text-6xl lg:text-[4.85rem]">
              Tu negocio, más claro. Tu próximo paso, <span className="text-[#2d8b5d]">más simple.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#53685e] sm:text-xl">
              Calculá, diagnosticá y organizá las decisiones importantes desde un ecosistema pensado para pequeños negocios.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostico" className="focus-ring inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#153f2e] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#153f2e]/15 transition hover:-translate-y-0.5 hover:bg-[#0d3223]">
                Diagnosticar mi negocio <Arrow />
              </Link>
              <Link href="/herramientas" className="focus-ring inline-flex min-h-13 items-center justify-center rounded-full border border-[#c7dacf] bg-white px-7 py-3.5 text-sm font-extrabold text-[#153f2e] transition hover:border-[#95b9a4] hover:bg-[#f8fbf9]">
                Ver las 3 herramientas
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#6e8178]">
              <span>✓ Empezá gratis</span><span>✓ Sin tarjeta</span><span>✓ Resultado inmediato</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-12 -top-10 size-40 rounded-full bg-[#ddef7e]/35 blur-3xl" />
            <div className="soft-shadow relative overflow-hidden rounded-[2rem] border border-[#c9ded1] bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-[#e1ebe5] pb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#6c8378]">Panel Growtella</p>
                  <p className="mt-1 text-xl font-black tracking-tight text-[#153f2e]">El pulso de tu negocio</p>
                </div>
                <span className="rounded-full bg-[#e7f5ec] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#27724e]">En orden</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[.8fr_1.2fr]">
                <div className="rounded-2xl bg-[#153f2e] p-5 text-white">
                  <p className="text-xs font-bold text-white/58">Puntaje general</p>
                  <div className="mt-4 flex items-end gap-1"><span className="text-5xl font-black tracking-[-.06em]">74</span><span className="pb-1 text-sm font-bold text-white/40">/100</span></div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/12"><div className="h-full w-[74%] rounded-full bg-[#8ee2b0]" /></div>
                  <p className="mt-3 text-[11px] font-bold text-[#a8e9c3]">Base en crecimiento</p>
                </div>
                <div className="rounded-2xl border border-[#dce8e0] bg-[#f7faf8] p-5">
                  <div className="flex items-center justify-between"><p className="text-xs font-bold text-[#70837a]">Prioridad de la semana</p><span className="grid size-7 place-items-center rounded-lg bg-white text-xs shadow-sm">01</span></div>
                  <p className="mt-4 font-black leading-5 text-[#1c4132]">Definir una meta comercial medible</p>
                  <p className="mt-2 text-xs leading-5 text-[#71837b]">Una prioridad, un número y una fecha.</p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-[#dce8e0] p-4">
                <div className="mb-3 flex items-center justify-between"><p className="text-xs font-black text-[#294739]">Tus herramientas</p><span className="text-[10px] font-bold text-[#71837b]">2 activas · 1 próxima</span></div>
                <div className="grid grid-cols-3 gap-2">
                  {products.map((product, index) => (
                    <div key={product.name} className="rounded-xl bg-[#f3f8f5] p-3">
                      <span className="text-base text-[#26734f]">{productIcons[index]}</span>
                      <p className="mt-2 line-clamp-2 text-[10px] font-black leading-4 text-[#294739]">{product.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-[#d5e4db] bg-white px-4 py-3 shadow-xl shadow-[#153f2e]/10 sm:flex">
              <span className="grid size-9 place-items-center rounded-xl bg-[#e5f5eb] text-[#24714c]">↗</span>
              <div><p className="text-[10px] font-bold text-[#71837b]">Próximo paso</p><p className="text-xs font-black text-[#244437]">Listo para accionar</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e3ebe6] bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#e3ebe6] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[["01", "Una cuenta", "para todo el ecosistema"], ["02", "Un plan Pro", "con tres formas de pago"], ["03", "Una prioridad", "para saber qué hacer hoy"]].map(([number, title, text]) => (
            <div key={title} className="flex items-center justify-center gap-4 px-4 py-7 md:justify-start">
              <span className="font-mono text-xs font-black text-[#45946d]">{number}</span><div><p className="text-sm font-black text-[#153f2e]">{title}</p><p className="mt-0.5 text-sm text-[#71827a]">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="herramientas" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">Ecosistema de herramientas</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-.05em] text-[#10291f] sm:text-5xl">Tres soluciones. Una misma lógica.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#5b6f66] lg:justify-self-end">Cada producto resuelve un problema concreto y muestra desde el inicio cuánto cuesta y qué incluye.</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {products.map((product, index) => (
              <article id={product.status === "coming" ? "proximamente" : undefined} key={product.name} className={`card-hover flex min-h-[440px] flex-col rounded-[1.75rem] border p-7 ${index === 0 ? "border-[#bcd7c6] bg-[#f5faf7]" : "border-[#dce8e0] bg-white"}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className={`grid size-13 place-items-center rounded-2xl text-xl ${index === 0 ? "bg-[#153f2e] text-white" : "bg-[#e8f6ed] text-[#256b49]"}`}>{productIcons[index]}</span>
                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] ${product.status === "available" ? "bg-[#dff4e7] text-[#216e49]" : "bg-[#f2f5df] text-[#70782d]"}`}>{product.status === "available" ? "Disponible" : "Próximamente"}</span>
                </div>
                <p className="mt-7 text-[10px] font-black uppercase tracking-[.15em] text-[#71837b]">{product.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-black tracking-[-.035em] text-[#153f2e]">{product.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-[#5b6f66]">{product.description}</p>
                {product.status === "available" ? (
                  <div className="mt-5 border-y border-[#e1ebe5] py-5">
                    <p className="text-2xl font-black tracking-tight text-[#153f2e]">{product.price}</p>
                    <p className="mt-1 text-xs font-bold text-[#71837b]">{product.priceDetail}</p>
                  </div>
                ) : (
                  <div className="mt-5 border-y border-[#e7ebd6] bg-[#fafbf3] py-5">
                    <p className="text-xl font-black tracking-tight text-[#687228]">Próximamente</p>
                    <p className="mt-1 text-xs font-bold text-[#7c8460]">Todavía no está habilitada</p>
                  </div>
                )}
                <ul className="mt-5 grid flex-1 gap-2.5">
                  {product.features.map((feature) => <Check key={feature}>{feature}</Check>)}
                </ul>
                {product.status === "available" ? (
                  product.external ? <a href={product.href} className="focus-ring mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Abrir herramienta <Arrow /></a> : <Link href={product.href} className="focus-ring mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#153f2e] px-5 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Probar ahora <Arrow /></Link>
                ) : <span aria-disabled="true" className="mt-7 inline-flex cursor-not-allowed justify-center rounded-full border border-[#dfe3c9] bg-[#f8f9f1] px-5 py-3 text-sm font-black text-[#777d4d]">Próximamente · no disponible</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="diagnostico" className="border-y border-[#dce9e1] bg-[#f2f8f4] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <div>
              <p className="eyebrow">Growtella también analiza</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-.05em] text-[#10291f] sm:text-5xl">Una radiografía real de tu negocio.</h2>
              <p className="mt-5 text-lg leading-8 text-[#5b6f66]">El Diagnóstico 360° evalúa 15 indicadores, calcula tu salud financiera y construye un plan de 30 días según tus prioridades.</p>
              <ul className="mt-7 grid gap-3">
                {[
                  "Cinco áreas: finanzas, ventas, oferta, operaciones y dirección",
                  "Margen, resultado y punto de equilibrio con tus números",
                  "Informe privado y plan priorizado de cuatro semanas",
                ].map((item) => <Check key={item}>{item}</Check>)}
              </ul>
              <Link href="/diagnostico" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-[#153f2e] px-6 py-3.5 text-sm font-black text-white hover:bg-[#0d3223]">Comenzar diagnóstico completo <Arrow /></Link>
              <p className="mt-4 text-xs font-bold text-[#71837b]">Gratis · Sin cuenta · Tus datos no salen del navegador</p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#bfd7c8] bg-white shadow-[0_24px_70px_rgba(20,73,50,.1)]">
              <div className="flex items-center justify-between border-b border-[#e1ebe5] px-6 py-5"><div><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#668176]">Ejemplo de informe</p><p className="mt-1 font-black text-[#153f2e]">Mapa de madurez Growtella</p></div><span className="rounded-full bg-[#e5f5eb] px-3 py-1.5 text-[10px] font-black text-[#26734f]">15 indicadores</span></div>
              <div className="grid sm:grid-cols-[.62fr_1.38fr]">
                <div className="bg-[#123d2b] p-6 text-white"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#9ce1b8]">Índice general</p><div className="mt-5 flex items-end gap-1"><span className="text-6xl font-black tracking-[-.08em]">68</span><span className="pb-2 text-sm font-bold text-white/35">/100</span></div><p className="mt-4 text-sm font-black">En consolidación</p><p className="mt-2 text-xs leading-5 text-white/52">Una base clara con dos áreas listas para mejorar.</p></div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {[["Finanzas", 72], ["Ventas", 48], ["Oferta", 81], ["Operaciones", 57], ["Dirección", 76]].map(([label, score]) => (
                      <div key={label} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2"><span className="text-[10px] font-black text-[#4e675c]">{label}</span><div className="h-2 overflow-hidden rounded-full bg-[#edf3ef]"><div className={`h-full rounded-full ${Number(score) < 55 ? "bg-[#d39b52]" : "bg-[#329065]"}`} style={{ width: `${score}%` }} /></div><span className="text-right font-mono text-[10px] font-black text-[#587066]">{score}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e1ebe5] bg-[#f8fbf9] p-5"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Primera prioridad detectada</p><div className="mt-3 flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f3e6d2] text-xs font-black text-[#9a632b]">01</span><div><p className="text-sm font-black text-[#294739]">Construir un sistema comercial semanal</p><p className="mt-1 text-xs leading-5 text-[#71837b]">Meta, registro de oportunidades y seguimiento con próximo paso.</p></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="precios" className="bg-[#102f23] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.17em] text-[#91dfae]">Precios transparentes</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">Un solo Pro. Tres formas de pagarlo.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/62 lg:justify-self-end">Las funciones gratuitas siguen siendo gratuitas. Pro amplía IA, historial y exportaciones en todo el ecosistema.</p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {BILLING_OPTIONS.map((option) => (
              <article key={option.id} className={`relative rounded-[1.75rem] border p-7 ${option.id === "annual" ? "border-[#8bd8a8] bg-white text-[#153f2e] shadow-2xl shadow-black/15" : "border-white/12 bg-white/[.055]"}`}>
                {option.id === "annual" && <span className="absolute -top-3 left-7 rounded-full bg-[#8fdfaD] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] text-[#153f2e]">Mejor precio</span>}
                <div className="flex items-center justify-between gap-4">
                  <p className={`text-sm font-black ${option.id === "annual" ? "text-[#2c6f4e]" : "text-[#a5dfba]"}`}>{option.label}</p>
                  {option.discount > 0 && <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${option.id === "annual" ? "bg-[#e4f5ea] text-[#26734f]" : "bg-white/10 text-white/72"}`}>-{option.discount}%</span>}
                </div>
                <p className="mt-6 text-4xl font-black tracking-[-.05em]">{formatUsd(option.totalUsd)}</p>
                <p className={`mt-2 text-sm ${option.id === "annual" ? "text-[#687b71]" : "text-white/50"}`}>{option.months === 1 ? "por mes" : `pago cada ${option.months} meses`}</p>
                <div className={`mt-6 border-t pt-5 ${option.id === "annual" ? "border-[#dce8e0]" : "border-white/10"}`}>
                  <p className="text-sm font-black">{formatUsd(option.monthlyUsd)} <span className={`font-medium ${option.id === "annual" ? "text-[#71837b]" : "text-white/45"}`}>equivalentes por mes</span></p>
                  <p className={`mt-2 text-xs leading-5 ${option.id === "annual" ? "text-[#71837b]" : "text-white/45"}`}>{option.discount ? `Ahorrás ${option.discount}% frente al plan mensual.` : "Flexibilidad para cancelar mes a mes."}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[.045] p-5 sm:flex-row sm:px-7">
            <p className="text-sm leading-6 text-white/62"><span className="font-black text-white">Plan Gratis: US$ 0.</span> Incluye la Calculadora Emprendedora esencial y el Diagnóstico 360° sin registro.</p>
            <Link href="/pro" className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#153f2e] hover:bg-[#eaf7ef]">Comparar Gratis y Pro <Arrow /></Link>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.82fr_1.18fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Una experiencia coherente</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em] text-[#10291f] sm:text-5xl">Menos pestañas. Más continuidad.</h2>
            <p className="mt-5 text-lg leading-8 text-[#5b6f66]">Growtella acompaña una decisión desde la primera duda hasta el seguimiento, sin obligarte a aprender una plataforma compleja.</p>
          </div>
          <div className="grid gap-4">
            {[["01", "Detectá la prioridad", "Usá el Diagnóstico 360° para reconocer el área que más está frenando tu negocio."], ["02", "Resolvela con la herramienta correcta", "Abrí la calculadora, trabajá tu presupuesto o seguí el plan de acción sugerido."], ["03", "Conservá el contexto", "Tu cuenta reúne plan, historial, escenarios y uso de IA a medida que el ecosistema crece."]].map(([number, title, text]) => (
              <article key={number} className="rounded-3xl border border-[#dce8e0] bg-[#f9fbfa] p-7 sm:p-8">
                <div className="flex gap-5"><span className="font-mono text-sm font-black text-[#3f8c66]">{number}</span><div><h3 className="text-xl font-black tracking-tight text-[#153f2e]">{title}</h3><p className="mt-3 leading-7 text-[#5b6f66]">{text}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#dce9e1] bg-[#edf6f0] py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="eyebrow">Empezá por una respuesta</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-.05em] text-[#10291f] sm:text-5xl">Hoy no necesitás hacer más. Necesitás saber qué hacer primero.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#5b6f66]">Completá el diagnóstico o abrí la calculadora. Las dos opciones son gratis y dan un resultado inmediato.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/diagnostico" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#153f2e] px-7 py-3.5 text-sm font-black text-white hover:bg-[#0d3223]">Hacer diagnóstico <Arrow /></Link>
            <a href={siteConfig.calculatorUrl} className="focus-ring inline-flex items-center justify-center rounded-full border border-[#bfd3c7] bg-white px-7 py-3.5 text-sm font-black text-[#153f2e] hover:bg-[#f7faf8]">Abrir calculadora</a>
          </div>
        </div>
      </section>
    </main>
  );
}
