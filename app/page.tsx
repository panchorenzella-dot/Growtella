import Link from "next/link";
import { products, siteConfig } from "@/lib/site";

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-[#496057]">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#dff4e7] text-xs font-black text-[#1c6b45]">✓</span>
      <span>{children}</span>
    </li>
  );
}

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative border-b border-[#e0ebe4] bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)]">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.04fr_.96fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe3d6] bg-white px-3.5 py-2 text-xs font-bold text-[#286847] shadow-sm">
              <span className="size-2 rounded-full bg-[#5bc887] shadow-[0_0_0_4px_#e4f6eb]" />
              Un lugar para hacer crecer tu negocio
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.06em] text-[#10291f] sm:text-6xl lg:text-[4.9rem]">
              Decisiones más claras. Negocios que <span className="text-[#2f8b5e]">crecen mejor.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#53685e] sm:text-xl">
              Growtella reúne calculadoras, inteligencia artificial y herramientas simples para ayudarte a entender tus números y avanzar con confianza.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/herramientas" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#153f2e] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#153f2e]/15 transition hover:-translate-y-0.5 hover:bg-[#0d3223] focus-ring">
                Explorar herramientas <Arrow />
              </Link>
              <a href={siteConfig.calculatorUrl} className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#ccddd3] bg-white px-7 py-3.5 text-sm font-extrabold text-[#153f2e] transition hover:border-[#9fc1ad] hover:bg-[#f7fbf8] focus-ring">
                Probar la calculadora
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6e8178]">
              <span>✓ Herramientas gratuitas</span><span>✓ Sin tarjeta</span><span>✓ Resultados claros</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-12 top-8 size-32 rounded-full bg-[#bcebcf]/55 blur-3xl" />
            <div className="absolute -right-10 bottom-4 size-40 rounded-full bg-[#ddf58f]/40 blur-3xl" />
            <div className="soft-shadow relative overflow-hidden rounded-[2rem] border border-[#cfe1d6] bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-[#e3ece6] pb-5">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#6c8378]">Tu espacio Growtella</p>
                  <p className="mt-1 text-xl font-black tracking-tight text-[#153f2e]">Resumen del negocio</p>
                </div>
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f6ed] text-lg">↗</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#153f2e] p-5 text-white">
                  <p className="text-xs font-semibold text-white/60">Margen estimado</p>
                  <p className="mt-3 text-3xl font-black tracking-tight">44,0%</p>
                  <p className="mt-5 text-xs font-bold text-[#a8e9c3]">Resultado saludable</p>
                </div>
                <div className="rounded-2xl border border-[#dce9e1] bg-[#f7faf8] p-5">
                  <p className="text-xs font-semibold text-[#75877f]">Ganancia por unidad</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">$11.000</p>
                  <p className="mt-5 text-xs font-bold text-[#398061]">+12% este mes</p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-[#dce9e1] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-[#153f2e]">Herramientas activas</p>
                  <span className="rounded-full bg-[#ecf7f0] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#2c7551]">1 disponible</span>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f4f8f5] p-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-lg shadow-sm">⌁</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#244437]">Calculadora Emprendedora</p><p className="text-xs text-[#71827a]">Precios, costos y rentabilidad</p></div>
                  <span className="text-[#3b7f60]">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e3ebe6] bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#e3ebe6] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[['Una cuenta','para todas tus herramientas'],['Créditos compartidos','para utilizar la IA'],['Un solo plan Pro','con beneficios en todo Growtella']].map(([title, text]) => (
            <div key={title} className="px-3 py-7 text-center first:pl-0 last:pr-0">
              <p className="text-sm font-black text-[#153f2e]">{title}</p><p className="mt-1 text-sm text-[#71827a]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="herramientas" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Herramientas que resuelven</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-[#10291f] sm:text-5xl">Menos complicaciones. Más claridad para decidir.</h2>
            <p className="mt-5 text-lg leading-8 text-[#5b6f66]">Empezamos por los problemas reales de quienes emprenden y construimos una solución simple para cada uno.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {products.map((product, index) => (
              <article id={product.status === 'coming' ? 'proximamente' : undefined} key={product.name} className={`card-hover relative overflow-hidden rounded-[1.75rem] border p-7 sm:p-9 ${index === 0 ? 'border-[#bed8c8] bg-[#f5faf7]' : 'border-[#e0e9e3] bg-white'}`}>
                <div className="flex items-start justify-between gap-5">
                  <span className={`grid size-14 place-items-center rounded-2xl text-2xl ${index === 0 ? 'bg-[#153f2e] text-white' : 'bg-[#eafaef] text-[#256b49]'}`}>{index === 0 ? '⌁' : '✦'}</span>
                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] ${product.status === 'available' ? 'bg-[#dff4e7] text-[#216e49]' : 'bg-[#f1f4e1] text-[#6b7627]'}`}>
                    {product.status === 'available' ? 'Disponible' : 'Próximamente'}
                  </span>
                </div>
                <p className="mt-8 text-xs font-extrabold uppercase tracking-[.13em] text-[#6f8279]">{product.eyebrow}</p>
                <h3 className="mt-2 text-3xl font-black tracking-[-.035em] text-[#153f2e]">{product.name}</h3>
                <p className="mt-4 max-w-xl leading-7 text-[#5b6f66]">{product.description}</p>
                {product.status === 'available' ? (
                  <a href={product.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#153f2e] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#0d3223] focus-ring">Abrir herramienta <Arrow /></a>
                ) : (
                  <span className="mt-8 inline-flex rounded-full border border-[#cfddd4] bg-white px-5 py-3 text-sm font-extrabold text-[#61746b]">En desarrollo</span>
                )}
              </article>
            ))}
          </div>
          <div className="mt-8 text-center"><Link href="/herramientas" className="text-sm font-extrabold text-[#246d4a] underline decoration-[#a9cfb9] underline-offset-4 hover:text-[#153f2e]">Ver el catálogo completo</Link></div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-[#e2ebe5] bg-[#f7faf8] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">El ecosistema Growtella</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-[#10291f] sm:text-5xl">Todo conectado alrededor de tu negocio.</h2>
              <p className="mt-5 text-lg leading-8 text-[#5b6f66]">Cada herramienta suma valor sin obligarte a crear cuentas, planes o configuraciones nuevas.</p>
            </div>
            <div className="grid gap-4">
              {[['01','Una cuenta central','Ingresá una vez y accedé a tus herramientas, historial y preferencias desde un mismo lugar.'],['02','Información que te acompaña','Tus cálculos, presupuestos y análisis quedan organizados para que puedas retomarlos.'],['03','Pro en toda la plataforma','Una suscripción desbloquea beneficios en las aplicaciones actuales y las que se sumen después.']].map(([n,title,text]) => (
                <article key={n} className="rounded-3xl border border-[#dce8e0] bg-white p-7 sm:p-8">
                  <div className="flex gap-5"><span className="font-mono text-sm font-bold text-[#3f8c66]">{n}</span><div><h3 className="text-xl font-black tracking-tight text-[#153f2e]">{title}</h3><p className="mt-3 leading-7 text-[#5b6f66]">{text}</p></div></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#123d2b] px-6 py-12 text-white sm:px-12 sm:py-16 lg:grid lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-12">
            <div className="absolute -right-16 -top-24 size-72 rounded-full border-[50px] border-white/5" />
            <div className="relative">
              <p className="text-xs font-extrabold uppercase tracking-[.17em] text-[#9de3ba]">Growtella Pro</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.045em] sm:text-5xl">Un plan para todas tus herramientas.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/68">Más créditos de IA, historial avanzado, exportaciones y acceso a las próximas funciones, sin pagar por cada aplicación.</p>
              <Link href="/pro" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#153f2e] transition hover:bg-[#eaf7ef] focus-ring">Conocer Growtella Pro <Arrow /></Link>
            </div>
            <ul className="relative mt-10 grid gap-3 rounded-2xl bg-white p-6 lg:mt-0">
              <Check>Beneficios en todas las aplicaciones</Check><Check>Créditos de IA compartidos</Check><Check>Historial y exportaciones</Check><Check>Acceso anticipado a novedades</Check>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e1eae4] bg-[#f3f8f5] py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="eyebrow">Empezá hoy</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-[#10291f] sm:text-5xl">Tu próximo paso puede ser mucho más claro.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#5b6f66]">Probá la primera herramienta de Growtella y entendé mejor los números de tu negocio.</p>
          <a href={siteConfig.calculatorUrl} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#153f2e] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#153f2e]/15 transition hover:-translate-y-0.5 hover:bg-[#0d3223] focus-ring">Abrir Calculadora Emprendedora <Arrow /></a>
        </div>
      </section>
    </main>
  );
}
