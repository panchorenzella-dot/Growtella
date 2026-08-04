"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BILLING_OPTIONS, type BillingInterval } from "@/lib/plans";
import { getSupabaseClient } from "@/lib/supabase/client";

function usd(value: number) {
  return `US$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function trackCheckout(interval: BillingInterval, value: number) {
  const analyticsWindow = window as Window & {
    gtag?: (command: "event", eventName: string, parameters: Record<string, unknown>) => void;
  };
  analyticsWindow.gtag?.("event", "begin_checkout", {
    currency: "USD",
    value,
    items: [{ item_id: `growtella_pro_${interval}`, item_name: `Growtella Pro ${interval}`, price: value, quantity: 1 }],
  });
}

export function GrowtellaPricing({ paypalReady, paypalMode }: { paypalReady: boolean; paypalMode: "sandbox" | "live" }) {
  const [selected, setSelected] = useState<BillingInterval>("annual");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("paypal") === "cancelled"
      ? "Cancelaste el proceso antes de confirmar. No se realizó ningún cobro."
      : "";
  });
  const option = BILLING_OPTIONS.find((item) => item.id === selected) ?? BILLING_OPTIONS[2];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paypal") === "cancelled") {
      window.history.replaceState({}, "", "/pro");
    }
  }, []);

  async function startCheckout() {
    setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("El acceso a la cuenta todavía no está disponible.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage("Primero iniciá sesión con tu cuenta Growtella. Después vas a volver acá para elegir el plan.");
        return;
      }

      const response = await fetch("/api/paypal/subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interval: selected, requestId: crypto.randomUUID() }),
      });
      const data = await response.json() as { approvalUrl?: string; error?: string };
      if (!response.ok || !data.approvalUrl) {
        setMessage(data.error || "No pudimos abrir PayPal.");
        return;
      }
      trackCheckout(selected, option.totalUsd);
      window.location.assign(data.approvalUrl);
    } catch {
      setMessage("No pudimos conectar con PayPal. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <div role="tablist" aria-label="Período de facturación" className="grid grid-cols-3 rounded-2xl bg-[#0d3223] p-1">
        {BILLING_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === item.id}
            onClick={() => setSelected(item.id)}
            className={`rounded-xl px-2 py-3 text-xs font-black transition sm:text-sm ${selected === item.id ? "bg-white text-[#153f2e] shadow-sm" : "text-white/65 hover:text-white"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black tracking-[-.04em] text-white">{usd(option.totalUsd)}</p>
          <p className="mt-1 text-sm text-white/58">por {option.months === 1 ? "mes" : `${option.months} meses`}</p>
        </div>
        {option.discount > 0 && <span className="rounded-full bg-[#9ce1b8] px-3 py-1.5 text-xs font-black text-[#153f2e]">Ahorrás {option.discount}%</span>}
      </div>
      <p className="mt-4 text-sm leading-6 text-white/62">
        {option.months === 1
          ? "Renovación mensual. Podés cancelar desde PayPal."
          : `${usd(option.monthlyUsd)} por mes, facturado en un único pago cada ${option.months} meses.`}
      </p>

      <button
        type="button"
        disabled={!paypalReady || loading}
        onClick={() => void startCheckout()}
        className="mt-6 w-full rounded-full bg-white px-5 py-4 text-sm font-black text-[#153f2e] transition hover:bg-[#eaf7ef] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {loading ? "Abriendo PayPal..." : !paypalReady ? "Terminando la conexión segura..." : paypalMode === "sandbox" ? "Probar checkout sin cobro" : "Continuar con PayPal"}
      </button>
      {paypalMode === "sandbox" && paypalReady && <p className="mt-3 text-center text-xs font-bold text-[#ffdca0]">Modo de prueba: no se mueve dinero real.</p>}
      {message && (
        <div role="alert" className="mt-4 rounded-2xl border border-white/12 bg-white/[.07] p-4 text-sm leading-6 text-white/82">
          <p>{message}</p>
          {message.startsWith("Primero") && <Link href="/cuenta?next=/pro" className="mt-3 inline-flex font-black text-[#a6e6bf]">Iniciar sesión →</Link>}
        </div>
      )}
      <p className="mt-4 text-center text-[11px] leading-5 text-white/40">Pago seguro procesado por PayPal en USD. Verás el importe final antes de confirmar.</p>
    </div>
  );
}
