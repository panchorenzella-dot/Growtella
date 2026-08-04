"use client";

import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { products, siteConfig } from "@/lib/site";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "reset" | "update";
type PlanInfo = {
  plan: "free" | "pro";
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled";
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  provider: string | null;
};
type UsageItem = {
  resource: "analysis" | "chat" | "scenario";
  used: number;
  quota_limit: number | null;
  resets_at: string | null;
  plan: "free" | "pro";
};
type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  date: string;
  href: string;
  kind: "analysis" | "scenario";
};

const FREE_PLAN: PlanInfo = {
  plan: "free",
  status: "inactive",
  current_period_end: null,
  cancel_at_period_end: false,
  provider: null,
};

function defaultUsage(plan: "free" | "pro" = "free"): UsageItem[] {
  return [
    { resource: "analysis", used: 0, quota_limit: plan === "pro" ? 30 : 1, resets_at: null, plan },
    { resource: "chat", used: 0, quota_limit: plan === "pro" ? 300 : 5, resets_at: null, plan },
    { resource: "scenario", used: 0, quota_limit: plan === "pro" ? null : 3, resets_at: null, plan },
  ];
}

function profileFromSession(session: Session | null) {
  const metadata = session?.user.user_metadata ?? {};
  return {
    full_name: String(metadata.full_name || metadata.name || ""),
    business_name: String(metadata.business_name || ""),
    role: String(metadata.role || ""),
    city: String(metadata.city || ""),
  };
}

function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "El email o la contraseña no son correctos.";
  if (normalized.includes("email not confirmed")) return "Primero confirmá tu email desde el mensaje que te enviamos.";
  if (normalized.includes("user already registered")) return "Ya existe una cuenta con ese email. Probá ingresar.";
  if (normalized.includes("password should be")) return "La contraseña debe tener al menos 8 caracteres.";
  if (normalized.includes("rate limit")) return "Hiciste varios intentos. Esperá un momento y volvé a probar.";
  return message;
}

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function effectivePlan(plan: PlanInfo | null): PlanInfo {
  if (!plan || plan.plan !== "pro") return FREE_PLAN;
  const validStatus = plan.status === "active" || plan.status === "trialing" || plan.status === "past_due";
  const periodEnd = plan.current_period_end ? new Date(plan.current_period_end).getTime() : null;
  const validPeriod = periodEnd === null || (!Number.isNaN(periodEnd) && Date.now() <= periodEnd + 2 * 86_400_000);
  return validStatus && validPeriod ? plan : FREE_PLAN;
}

function UsageCard({ item }: { item: UsageItem }) {
  const labels = {
    analysis: ["Análisis con IA", "informes"],
    chat: ["Mensajes con IA", "mensajes"],
    scenario: ["Escenarios guardados", "escenarios"],
  } as const;
  const [label, unit] = labels[item.resource];
  const limit = item.quota_limit;
  const percentage = limit ? Math.min(100, Math.round((item.used / limit) * 100)) : 0;

  return (
    <article className="rounded-2xl border border-[#dce8e0] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#6c8177]">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-[#153f2e]">
            {item.used}<span className="text-base font-bold text-[#75877f]"> / {limit ?? "∞"}</span>
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-[#e9f6ee] text-[#2a7651]">
          {item.resource === "analysis" ? "✦" : item.resource === "chat" ? "↗" : "⌁"}
        </span>
      </div>
      {limit ? (
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf3ef]">
          <div className="h-full rounded-full bg-[#319267] transition-all" style={{ width: `${percentage}%` }} />
        </div>
      ) : (
        <p className="mt-5 text-sm font-bold text-[#2e7a55]">Uso ilimitado incluido</p>
      )}
      <p className="mt-3 text-xs text-[#75877f]">
        {limit ? `${Math.max(0, limit - item.used)} ${unit} disponibles` : "Sin límite mientras tu plan esté activo"}
        {item.resets_at ? ` · Se renueva ${formatDate(item.resets_at)}` : ""}
      </p>
    </article>
  );
}

export function AccountCenter() {
  const router = useRouter();
  const configured = hasSupabaseConfig();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);
  const [dataLoading, setDataLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<PlanInfo>(FREE_PLAN);
  const [usage, setUsage] = useState<UsageItem[]>(defaultUsage());
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [profile, setProfile] = useState(profileFromSession(null));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const paypalReturnHandled = useRef(false);

  const loadAccountData = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setDataLoading(true);

    const [planResult, usageResult, scenariosResult, analysesResult] = await Promise.all([
      supabase.from("user_plans").select("plan,status,current_period_end,cancel_at_period_end,provider").maybeSingle(),
      supabase.rpc("get_my_usage_summary"),
      supabase.from("saved_scenarios").select("id,title,calculator_type,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
      supabase.from("ai_conversations").select("id,title,calculator_name,updated_at", { count: "exact" }).order("updated_at", { ascending: false }).limit(5),
    ]);

    const activePlan = effectivePlan(planResult.data as PlanInfo | null);
    setPlan(activePlan);
    const usageData = usageResult.data as UsageItem[] | null;
    setUsage(!usageResult.error && usageData?.length ? usageData : defaultUsage(activePlan.plan));
    setScenarioCount(scenariosResult.count ?? scenariosResult.data?.length ?? 0);
    setAnalysisCount(analysesResult.count ?? analysesResult.data?.length ?? 0);

    const scenarioActivities: ActivityItem[] = (scenariosResult.data ?? []).map((item) => ({
      id: item.id,
      title: item.title || "Escenario guardado",
      detail: item.calculator_type,
      date: item.created_at,
      href: `${siteConfig.calculatorUrl}/perfil/escenarios/${item.id}`,
      kind: "scenario",
    }));
    const analysisActivities: ActivityItem[] = (analysesResult.data ?? []).map((item) => ({
      id: item.id,
      title: item.title || "Análisis con IA",
      detail: item.calculator_name,
      date: item.updated_at,
      href: `${siteConfig.calculatorUrl}/perfil/analisis/${item.id}`,
      kind: "analysis",
    }));
    setActivities([...scenarioActivities, ...analysisActivities].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 5));

    const errors = [planResult.error, usageResult.error, scenariosResult.error, analysesResult.error].filter(Boolean);
    if (errors.length) {
      setMessage("La cuenta está conectada, pero falta aplicar alguna migración de Supabase para mostrar todos los datos.");
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setProfile(profileFromSession(data.session));
      setLoading(false);
      if (data.session) void loadAccountData();
    });

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setProfile(profileFromSession(nextSession));
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setMode("update");
      if (nextSession) void loadAccountData();
      else {
        setPlan(FREE_PLAN);
        setUsage(defaultUsage());
        setActivities([]);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [loadAccountData]);

  useEffect(() => {
    if (!session || paypalReturnHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const paypalStatus = params.get("paypal");
    const subscriptionId = params.get("subscription_id");

    if (paypalStatus !== "success") {
      if (params.get("next") === "/pro") router.replace("/pro");
      return;
    }

    paypalReturnHandled.current = true;
    if (!subscriptionId) {
      queueMicrotask(() => setMessage("PayPal confirmó el regreso, pero todavía no informó la suscripción. Revisá tu plan en unos instantes."));
      window.history.replaceState({}, "", "/cuenta");
      return;
    }

    void (async () => {
      setDataLoading(true);
      setMessage("Estamos confirmando tu suscripción con PayPal...");
      try {
        const response = await fetch("/api/paypal/subscriptions/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscriptionId }),
        });
        const result = await response.json() as { message?: string; error?: string };
        setMessage(result.message || result.error || "Tu plan se está actualizando.");
        if (response.ok) {
          const analyticsWindow = window as Window & {
            gtag?: (command: "event", eventName: string, parameters: Record<string, unknown>) => void;
          };
          analyticsWindow.gtag?.("event", "purchase", {
            transaction_id: subscriptionId,
            affiliation: "Growtella Pro",
          });
          await loadAccountData();
        }
      } catch {
        setMessage("El pago regresó correctamente, pero no pudimos actualizar el plan todavía. Volvé a cargar esta página en unos minutos.");
      } finally {
        setDataLoading(false);
        window.history.replaceState({}, "", "/cuenta");
      }
    })();
  }, [loadAccountData, router, session]);

  const userName = useMemo(() => {
    const metadata = session?.user.user_metadata ?? {};
    return String(metadata.full_name || metadata.name || "Emprendedor/a");
  }, [session]);

  async function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSaving(true);
    setMessage("");

    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/cuenta` });
        if (error) throw error;
        setMessage("Te enviamos un enlace para crear una contraseña nueva.");
      } else if (mode === "update") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Tu contraseña se actualizó correctamente.");
        setMode("login");
      } else if (mode === "signup") {
        const next = new URLSearchParams(window.location.search).get("next") === "/pro" ? "?next=/pro" : "";
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/cuenta${next}`,
          },
        });
        if (error) throw error;
        setMessage(data.session ? "Tu cuenta Growtella ya está lista." : "Revisá tu email para confirmar la cuenta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("Ingresaste correctamente.");
        if (new URLSearchParams(window.location.search).get("next") === "/pro") router.push("/pro");
      }
    } catch (error) {
      setMessage(friendlyAuthError(error instanceof Error ? error.message : "No pudimos completar el acceso."));
    } finally {
      setSaving(false);
    }
  }

  async function signInWithGoogle() {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSaving(true);
    setMessage("Abriendo Google...");
    const next = new URLSearchParams(window.location.search).get("next") === "/pro" ? "?next=/pro" : "";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/cuenta${next}`, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      setSaving(false);
      setMessage(friendlyAuthError(error?.message || "No pudimos abrir Google."));
      return;
    }
    window.location.assign(data.url);
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSaving(true);
    setMessage("");
    const { data, error } = await supabase.auth.updateUser({ data: profile });
    setSaving(false);
    if (error) setMessage(friendlyAuthError(error.message));
    else {
      if (data.user) setSession((current) => current ? { ...current, user: data.user } : current);
      setEditing(false);
      setMessage("Tu perfil se guardó para todas las herramientas de Growtella.");
    }
  }

  if (!configured) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-[2rem] border border-[#cfe2d6] bg-[#f4faf6] p-8 text-center sm:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#153f2e] text-xl text-white">⌁</span>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-[#153f2e]">La cuenta central está construida.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#5b6f66]">Para activarla en esta instalación hay que agregar el mismo proyecto de Supabase que utiliza Calculadora Emprendedora.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="grid min-h-[440px] place-items-center text-sm font-bold text-[#6d8077]">Conectando tu cuenta Growtella...</div>;
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#d4e4da] bg-white shadow-xl shadow-[#153f2e]/8 lg:grid-cols-[1.08fr_.92fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <span className="inline-flex rounded-full bg-[#e7f5ec] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-[#28734e]">Cuenta Growtella</span>
            <h2 className="mt-5 text-3xl font-black tracking-[-.04em] text-[#153f2e] sm:text-4xl">
              {mode === "signup" ? "Creá tu cuenta central." : mode === "reset" ? "Recuperá tu acceso." : mode === "update" ? "Elegí una contraseña nueva." : "Volvé a tu espacio."}
            </h2>
            <p className="mt-4 leading-7 text-[#5b6f66]">La misma cuenta sirve para la calculadora, tu plan Pro y las próximas herramientas.</p>

            {mode !== "reset" && mode !== "update" && (
              <button type="button" onClick={() => void signInWithGoogle()} disabled={saving} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-[#cfded5] bg-white px-5 py-3.5 text-sm font-extrabold text-[#153f2e] transition hover:bg-[#f5faf7] disabled:opacity-60">
                <span className="text-base font-black text-[#4285f4]">G</span> Continuar con Google
              </button>
            )}

            {mode !== "reset" && mode !== "update" && <div className="my-5 flex items-center gap-3 text-xs font-bold text-[#8a9a92]"><span className="h-px flex-1 bg-[#e1eae4]" />o con email<span className="h-px flex-1 bg-[#e1eae4]" /></div>}

            <form onSubmit={submitAuth} className="grid gap-3">
              {mode === "signup" && <input required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nombre completo" className="rounded-2xl border border-[#d7e4dc] px-4 py-3.5 text-sm text-[#153f2e] outline-none focus:border-[#78ae8e]" />}
              {mode !== "update" && <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="rounded-2xl border border-[#d7e4dc] px-4 py-3.5 text-sm text-[#153f2e] outline-none focus:border-[#78ae8e]" />}
              {mode !== "reset" && <input required type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "update" ? "Contraseña nueva" : "Contraseña"} className="rounded-2xl border border-[#d7e4dc] px-4 py-3.5 text-sm text-[#153f2e] outline-none focus:border-[#78ae8e]" />}
              <button disabled={saving} className="mt-1 rounded-full bg-[#153f2e] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0d3223] disabled:opacity-60">
                {saving ? "Procesando..." : mode === "signup" ? "Crear cuenta" : mode === "reset" ? "Enviar enlace" : mode === "update" ? "Guardar contraseña" : "Ingresar"}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#47705d]">
              {mode === "login" && <><button onClick={() => { setMode("signup"); setMessage(""); }}>Crear cuenta</button><button onClick={() => { setMode("reset"); setMessage(""); }}>Olvidé mi contraseña</button></>}
              {mode !== "login" && mode !== "update" && <button onClick={() => { setMode("login"); setMessage(""); }}>Volver a ingresar</button>}
            </div>
            {message && <p role="status" className="mt-5 rounded-2xl border border-[#d7e5dc] bg-[#f5faf7] p-4 text-sm leading-6 text-[#486055]">{message}</p>}
          </div>

          <div className="bg-[#153f2e] p-7 text-white sm:p-10 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[.15em] text-[#9de0b8]">Todo conectado</p>
            <h3 className="mt-4 text-3xl font-black tracking-tight">Una identidad. Todas tus herramientas.</h3>
            <div className="mt-8 grid gap-4">
              {["Plan Pro reconocido en toda la plataforma", "Usos de IA compartidos y protegidos", "Escenarios e historial en un mismo lugar", "Perfil que se actualiza en todas las aplicaciones"].map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/[.07] p-4 text-sm leading-6 text-white/82"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#8bdbab] text-xs font-black text-[#153f2e]">✓</span>{item}</div>)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const initials = userName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      {message && <div role="status" className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-[#d8e5dd] bg-[#f4faf6] p-4 text-sm text-[#496057]"><span>{message}</span><button onClick={() => setMessage("")} aria-label="Cerrar mensaje" className="font-black">×</button></div>}

      <div className="overflow-hidden rounded-[2rem] border border-[#d7e5dc] bg-white shadow-xl shadow-[#153f2e]/7">
        <div className="border-b border-[#e0eae3] bg-[linear-gradient(135deg,#f5faf7,#ffffff)] p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#153f2e] text-sm font-black text-white">{initials || "G"}</span>
              <div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-[#6a8176]">Tu espacio Growtella</p><h2 className="mt-1 text-3xl font-black tracking-tight text-[#153f2e]">Hola, {userName.split(" ")[0]}</h2><p className="mt-1 text-sm text-[#708078]">{session.user.email}</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-[.12em] ${plan.plan === "pro" ? "bg-[#153f2e] text-[#a6e6bf]" : "bg-[#e9f4ed] text-[#397258]"}`}>{plan.plan === "pro" ? "Growtella Pro" : "Plan gratuito"}</span>
              <button onClick={() => void getSupabaseClient()?.auth.signOut()} className="rounded-full border border-[#d2e0d7] px-4 py-2 text-xs font-black text-[#51685d] hover:bg-[#f5faf7]">Cerrar sesión</button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-9">
          <div className="grid gap-4 md:grid-cols-3">
            {usage.map((item) => <UsageCard key={item.resource} item={item} />)}
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
            <section className="rounded-3xl border border-[#dce7e0] p-6 sm:p-7">
              <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.13em] text-[#6b8276]">Actividad compartida</p><h3 className="mt-2 text-2xl font-black tracking-tight text-[#153f2e]">Continuá donde lo dejaste</h3></div>{dataLoading && <span className="text-xs font-bold text-[#7b8c84]">Actualizando...</span>}</div>
              <div className="mt-5 divide-y divide-[#e5ede8]">
                {activities.length ? activities.map((item) => <a key={`${item.kind}-${item.id}`} href={item.href} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf7f0] text-[#337453]">{item.kind === "analysis" ? "✦" : "⌁"}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-[#294739] group-hover:text-[#216945]">{item.title}</p><p className="mt-1 truncate text-xs text-[#7a8b83]">{item.detail} · {formatDate(item.date)}</p></div><span className="text-[#4a8065]">→</span></a>) : <div className="rounded-2xl bg-[#f6faf7] p-7 text-center"><p className="text-sm text-[#61746a]">Todavía no guardaste actividad.</p><a href={siteConfig.calculatorUrl} className="mt-4 inline-flex rounded-full bg-[#153f2e] px-4 py-2.5 text-xs font-black text-white">Empezar con la calculadora</a></div>}
              </div>
            </section>

            <section className="rounded-3xl border border-[#dce7e0] bg-[#f6faf7] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.13em] text-[#6b8276]">Perfil central</p><h3 className="mt-2 text-2xl font-black tracking-tight text-[#153f2e]">Tus datos</h3></div>{!editing && <button onClick={() => setEditing(true)} className="rounded-full border border-[#cadcd1] bg-white px-4 py-2 text-xs font-black text-[#365d49]">Editar</button>}</div>
              {editing ? <form onSubmit={saveProfile} className="mt-5 grid gap-3">{[["full_name","Nombre completo"],["business_name","Emprendimiento"],["role","Actividad"],["city","Ciudad"]].map(([key,label]) => <label key={key} className="grid gap-1.5 text-xs font-bold text-[#65786f]">{label}<input value={profile[key as keyof typeof profile]} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} className="rounded-xl border border-[#d6e3db] bg-white px-4 py-3 text-sm text-[#153f2e] outline-none focus:border-[#7bb192]" /></label>)}<div className="mt-2 flex gap-2"><button disabled={saving} className="rounded-full bg-[#153f2e] px-4 py-2.5 text-xs font-black text-white">{saving ? "Guardando..." : "Guardar"}</button><button type="button" onClick={() => setEditing(false)} className="rounded-full border border-[#cfddd4] bg-white px-4 py-2.5 text-xs font-black text-[#607269]">Cancelar</button></div></form> : <dl className="mt-5 grid gap-4 text-sm"><div><dt className="text-xs font-bold text-[#829088]">Nombre</dt><dd className="mt-1 font-extrabold text-[#294739]">{profile.full_name || userName}</dd></div><div><dt className="text-xs font-bold text-[#829088]">Emprendimiento</dt><dd className="mt-1 font-extrabold text-[#294739]">{profile.business_name || "Sin completar"}</dd></div><div><dt className="text-xs font-bold text-[#829088]">Actividad y ciudad</dt><dd className="mt-1 font-extrabold text-[#294739]">{[profile.role, profile.city].filter(Boolean).join(" · ") || "Sin completar"}</dd></div></dl>}
            </section>
          </div>

          <section className="mt-9">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.13em] text-[#6b8276]">Tus aplicaciones</p><h3 className="mt-2 text-2xl font-black tracking-tight text-[#153f2e]">Una cuenta para todo Growtella</h3></div><p className="text-sm text-[#718078]">{analysisCount} análisis · {scenarioCount} escenarios</p></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {products.map((product, index) => <article key={product.name} className="rounded-2xl border border-[#dce7e0] p-5"><div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-[#153f2e] text-white" : "bg-[#e9f6ee] text-[#28734e]"}`}>{index === 0 ? "⌁" : "✦"}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h4 className="font-black text-[#244437]">{product.name}</h4><span className="text-[10px] font-black uppercase tracking-[.1em] text-[#668176]">{product.status === "available" ? "Activa" : "Próximamente"}</span></div><p className="mt-2 text-sm leading-6 text-[#687a71]">{product.description}</p>{product.status === "available" ? <a href={product.href} className="mt-4 inline-flex text-xs font-black text-[#246d4a]">Abrir aplicación →</a> : <span className="mt-4 inline-flex text-xs font-black text-[#7a897f]">En desarrollo</span>}</div></div></article>)}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
