import { NextResponse } from "next/server";

import { createPayPalSubscription, getPayPalEnvironment, hasLocalPayPalConfig, PayPalApiError } from "@/lib/paypal/server";
import type { BillingInterval } from "@/lib/plans";
import { authenticateRequest } from "@/lib/supabase/server";

export const runtime = "nodejs";

const INTERVALS = new Set<BillingInterval>(["monthly", "quarterly", "annual"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validRequest(value: unknown): value is { interval: BillingInterval; requestId: string } {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return typeof input.interval === "string"
    && INTERVALS.has(input.interval as BillingInterval)
    && typeof input.requestId === "string"
    && UUID_PATTERN.test(input.requestId);
}

export async function POST(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Necesitás iniciar sesión para contratar Growtella Pro." }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!validRequest(body)) {
      return NextResponse.json({ error: "La opción de pago no es válida." }, { status: 400 });
    }

    const { data: currentPlan } = await authenticated.supabase
      .from("user_plans")
      .select("plan,status,provider,provider_subscription_id,current_period_end")
      .maybeSingle();

    const periodEnd = currentPlan?.current_period_end ? new Date(currentPlan.current_period_end).getTime() : null;
    const activeUntil = periodEnd === null || periodEnd + 2 * 86_400_000 > Date.now();
    const activeStatus = currentPlan?.status === "active" || currentPlan?.status === "trialing";
    if (currentPlan?.plan === "pro" && activeStatus && activeUntil) {
      return NextResponse.json({ error: "Tu cuenta ya tiene Growtella Pro activo." }, { status: 409 });
    }
    if (currentPlan?.provider === "paypal" && currentPlan.provider_subscription_id && currentPlan.status !== "canceled") {
      return NextResponse.json({ error: "Ya existe una suscripción de PayPal vinculada a esta cuenta." }, { status: 409 });
    }

    if (!hasLocalPayPalConfig()) {
      const gatewayUrl = (process.env.PAYMENT_GATEWAY_URL || process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://www.calculadoraemprendedora.com").replace(/\/$/, "");
      const gatewayResponse = await fetch(`${gatewayUrl}/api/paypal/subscriptions`, {
        method: "POST",
        headers: {
          Authorization: request.headers.get("authorization") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interval: body.interval, requestId: body.requestId, checkout: "growtella" }),
        cache: "no-store",
      });
      return new NextResponse(await gatewayResponse.text(), {
        status: gatewayResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const siteUrl = configuredSite || new URL(request.url).origin;
    const subscription = await createPayPalSubscription({
      interval: body.interval,
      userId: authenticated.user.id,
      requestId: body.requestId,
      returnUrl: `${siteUrl}/cuenta?paypal=success`,
      cancelUrl: `${siteUrl}/pro?paypal=cancelled`,
    });
    const approvalUrl = subscription.links?.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) throw new Error("PayPal no devolvió el enlace de aprobación.");

    return NextResponse.json({ approvalUrl, subscriptionId: subscription.id, environment: getPayPalEnvironment() });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "La opción de pago no es válida." }, { status: 400 });
    }
    if (error instanceof PayPalApiError) {
      console.error("PayPal subscription error", error.status, error.debugId ?? "no-debug-id");
      return NextResponse.json({ error: error.message }, { status: error.status >= 400 && error.status < 600 ? error.status : 502 });
    }
    console.error("PayPal subscription error", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "No pudimos iniciar el pago con PayPal." }, { status: 500 });
  }
}
