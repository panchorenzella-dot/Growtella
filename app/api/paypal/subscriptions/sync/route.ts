import { NextResponse } from "next/server";

import { getPayPalSubscription, hasLocalPayPalConfig, PayPalApiError } from "@/lib/paypal/server";
import { syncPayPalSubscription } from "@/lib/paypal/sync";
import { authenticateRequest } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SUBSCRIPTION_PATTERN = /^I-[A-Z0-9]+$/i;

export async function POST(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) return NextResponse.json({ error: "Tu sesión venció. Volvé a ingresar." }, { status: 401 });

    const body = await request.json() as { subscriptionId?: unknown };
    if (typeof body.subscriptionId !== "string" || body.subscriptionId.length > 80 || !SUBSCRIPTION_PATTERN.test(body.subscriptionId)) {
      return NextResponse.json({ error: "El identificador de PayPal no es válido." }, { status: 400 });
    }

    if (!hasLocalPayPalConfig()) {
      const gatewayUrl = (process.env.PAYMENT_GATEWAY_URL || process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://www.calculadoraemprendedora.com").replace(/\/$/, "");
      const gatewayResponse = await fetch(`${gatewayUrl}/api/paypal/subscriptions/sync`, {
        method: "POST",
        headers: {
          Authorization: request.headers.get("authorization") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId: body.subscriptionId }),
        cache: "no-store",
      });
      return new NextResponse(await gatewayResponse.text(), {
        status: gatewayResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subscription = await getPayPalSubscription(body.subscriptionId);
    if (subscription.custom_id !== authenticated.user.id) {
      return NextResponse.json({ error: "Esta suscripción no pertenece a tu cuenta." }, { status: 403 });
    }

    const result = await syncPayPalSubscription(subscription);
    if (!result.active) {
      return NextResponse.json({ pending: true, message: "PayPal todavía está confirmando la suscripción." }, { status: 202 });
    }
    return NextResponse.json({ active: true, message: "Pago confirmado. Growtella Pro ya está activo en todas tus herramientas." });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "El identificador de PayPal no es válido." }, { status: 400 });
    }
    if (error instanceof PayPalApiError) {
      console.error("PayPal sync error", error.status, error.debugId ?? "no-debug-id");
      return NextResponse.json({ error: "PayPal todavía no pudo confirmar la suscripción." }, { status: 502 });
    }
    console.error("PayPal sync error", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "No pudimos actualizar el plan en este momento." }, { status: 500 });
  }
}
