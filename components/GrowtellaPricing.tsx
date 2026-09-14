import { PRICING_PLANS } from "@/lib/plans";

function usd(value: number) {
  return `US$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function GrowtellaPricing({ pricingUrl }: { pricingUrl: string }) {
  return (
    <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
      {PRICING_PLANS.map((plan) => (
        <article
          id={`plan-${plan.id}`}
          key={plan.id}
          className={`relative flex flex-col rounded-[2rem] border p-7 sm:p-8 ${plan.id === "pro" ? "border-[#73c794] bg-[#153f2e] text-white shadow-2xl shadow-[#153f2e]/15" : "border-[#d9e6de] bg-white text-[#153f2e]"}`}
        >
          {"recommended" in plan && plan.recommended && (
            <span className="absolute -top-3 left-7 rounded-full bg-[#9ce1b8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] text-[#153f2e]">
              Recomendado
            </span>
          )}
          <p className={`text-sm font-black ${plan.id === "pro" ? "text-[#9ce1b8]" : "text-[#397258]"}`}>{plan.name}</p>
          <p className={`mt-1 min-h-10 text-sm font-bold ${plan.id === "pro" ? "text-white/62" : "text-[#71837b]"}`}>{plan.tagline}</p>
          <div className="mt-6 flex items-end gap-2">
            <p className="text-4xl font-black tracking-[-.05em]">{usd(plan.priceUsd)}</p>
            <p className={`pb-1 text-sm ${plan.id === "pro" ? "text-white/52" : "text-[#71837b]"}`}>/ mes</p>
          </div>
          <p className={`mt-5 min-h-24 text-sm leading-6 ${plan.id === "pro" ? "text-white/68" : "text-[#63766d]"}`}>{plan.description}</p>
          <ul className={`mt-6 grid flex-1 gap-3 border-t pt-6 text-sm ${plan.id === "pro" ? "border-white/10 text-white/82" : "border-[#e2ebe5] text-[#4c6258]"}`}>
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-black ${plan.id === "pro" ? "bg-[#9ce1b8] text-[#153f2e]" : "bg-[#e4f4ea] text-[#26734f]"}`}>✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href={`${pricingUrl}#plan-${plan.id}`}
            className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-black transition ${plan.id === "pro" ? "bg-white text-[#153f2e] hover:bg-[#eaf7ef]" : "bg-[#153f2e] text-white hover:bg-[#0d3223]"}`}
          >
            Elegir {plan.name}
          </a>
        </article>
      ))}
    </div>
  );
}
