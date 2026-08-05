"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

type AnswerMap = Record<string, number>;
type DimensionId = "finances" | "sales" | "offer" | "operations" | "direction";
type BusinessContext = {
  businessType: string;
  channel: string;
  customer: string;
  team: string;
  stage: string;
  goal: string;
  currency: "ARS" | "USD";
  revenue: string;
  fixedCosts: string;
  variableCosts: string;
  targetRevenue: string;
};

type DiagnosticQuestion = {
  id: string;
  label: string;
  helper: string;
  options: readonly [string, string, string, string];
};

type Dimension = {
  id: DimensionId;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  questions: readonly DiagnosticQuestion[];
  actions: readonly [string, string, string];
};

const STORAGE_KEY = "growtella-business-diagnostic-v3";

const businessTypes = [
  { id: "service", label: "Servicios", detail: "Vendés tiempo, trabajo o experiencia", icon: "◇" },
  { id: "product", label: "Productos", detail: "Fabricás o revendés productos", icon: "□" },
  { id: "food", label: "Comida y bebidas", detail: "Gastronomía, producción o pedidos", icon: "○" },
  { id: "digital", label: "Digital", detail: "Cursos, software o contenido", icon: "⌁" },
];

const channels = [
  { id: "inperson", label: "Presencial o local" },
  { id: "online", label: "Online" },
  { id: "both", label: "Presencial y online" },
  { id: "order", label: "Por pedido o a domicilio" },
];

const customers = [
  { id: "people", label: "Personas" },
  { id: "business", label: "Empresas" },
  { id: "both", label: "Personas y empresas" },
];

const teams = [
  { id: "solo", label: "Trabajo solo/a" },
  { id: "small", label: "Somos 2 a 5" },
  { id: "growing", label: "Somos 6 o más" },
];

const stages = [
  { id: "idea", label: "Idea o validación", detail: "Todavía estoy probando el modelo" },
  { id: "early", label: "Primeras ventas", detail: "Ya vendí, pero no es previsible" },
  { id: "stable", label: "Negocio estable", detail: "Tengo ventas y quiero ordenar" },
  { id: "growth", label: "En crecimiento", detail: "Quiero escalar sin perder control" },
];

const goals = [
  { id: "sell", label: "Vender más", icon: "↗" },
  { id: "profit", label: "Mejorar rentabilidad", icon: "%" },
  { id: "order", label: "Ordenar el negocio", icon: "⌁" },
  { id: "scale", label: "Prepararme para crecer", icon: "◎" },
];

function buildDimensions(context: BusinessContext): readonly Dimension[] {
  const type = context.businessType || "service";
  const isTeam = context.team && context.team !== "solo";
  const saleUnit = type === "service" ? "servicio" : type === "food" ? "pedido" : type === "digital" ? "venta" : "producto";
  const marginAction = type === "service"
    ? "Calculá horas, costos y margen de tus tres servicios principales."
    : type === "food"
      ? "Calculá el costo y el margen de los diez productos más vendidos."
      : type === "digital"
        ? "Medí el margen de cada producto digital incluyendo publicidad y comisiones."
        : "Calculá costo y margen de los diez productos más vendidos.";
  const salesQuestion = context.customer === "business"
    ? { label: "¿Seguís cada propuesta?", helper: "Cada propuesta necesita próximo paso.", options: ["No", "Con notas", "Con fechas", "Sí, con etapas"] as const }
    : { label: "¿Sabés cuántos clientes vuelven?", helper: "La recompra muestra lealtad real.", options: ["No", "Tengo una idea", "Lo mido a veces", "Sí, todos los meses"] as const };
  const channelQuestion = context.channel === "online"
    ? { label: "¿Sabés qué canal vende más?", helper: "Redes, web, anuncios o referidos.", options: ["No", "Lo intuyo", "Lo reviso", "Sí, lo comparo"] as const }
    : context.channel === "inperson"
      ? { label: "¿Sabés qué días vendés más?", helper: "Días y horarios cambian decisiones.", options: ["No", "Lo intuyo", "Lo anoto", "Sí, lo comparo"] as const }
      : context.channel === "both"
        ? { label: "¿Comparás online y presencial?", helper: "Cada canal debe justificar su esfuerzo.", options: ["No", "A veces", "Casi siempre", "Sí, cada mes"] as const }
        : { label: "¿Medís cuántos pedidos se repiten?", helper: "La repetición da previsibilidad.", options: ["No", "Lo intuyo", "Lo anoto", "Sí, cada mes"] as const };

  const offerQuestions: Record<string, readonly DiagnosticQuestion[]> = {
    service: [
      { id: "offer_1", label: "¿Tu servicio tiene un alcance claro?", helper: "Qué incluye y qué no.", options: ["No", "Depende del cliente", "Casi siempre", "Sí, está definido"] },
      { id: "offer_2", label: "¿Calculás horas antes de cotizar?", helper: "El tiempo también es costo.", options: ["No", "Estimo rápido", "Casi siempre", "Sí, lo registro"] },
      { id: "offer_3", label: "¿Tenés precios o paquetes definidos?", helper: "Reduce dudas y mejora la venta.", options: ["No", "Algunos", "Casi todos", "Sí, están claros"] },
    ],
    product: [
      { id: "offer_1", label: "¿Sabés qué producto deja más ganancia?", helper: "No siempre es el que más vende.", options: ["No", "Lo intuyo", "Lo calculé", "Sí, lo reviso"] },
      { id: "offer_2", label: "¿Controlás el stock?", helper: "Faltantes y exceso cuestan dinero.", options: ["No", "A mano", "Casi siempre", "Sí, está actualizado"] },
      { id: "offer_3", label: "¿Actualizás precios cuando suben costos?", helper: "Protegé el margen a tiempo.", options: ["Tarde", "A veces", "Casi siempre", "Sí, con una regla"] },
    ],
    food: [
      { id: "offer_1", label: "¿Conocés el costo de cada producto?", helper: "Incluí ingredientes y empaque.", options: ["No", "De algunos", "De casi todos", "Sí, actualizado"] },
      { id: "offer_2", label: "¿Medís desperdicios?", helper: "Lo que se pierde baja el margen.", options: ["No", "A ojo", "A veces", "Sí, cada semana"] },
      { id: "offer_3", label: "¿Sabés qué conviene impulsar?", helper: "Venta y margen deben mirarse juntos.", options: ["No", "Lo intuyo", "Lo calculé", "Sí, lo reviso"] },
    ],
    digital: [
      { id: "offer_1", label: "¿Medís cuántos visitantes compran?", helper: "Conversión de visita a venta.", options: ["No", "A veces", "Casi siempre", "Sí, por canal"] },
      { id: "offer_2", label: "¿Sabés cuánto cuesta conseguir un cliente?", helper: "Incluí anuncios y comisiones.", options: ["No", "Lo estimo", "Lo calculé", "Sí, lo sigo"] },
      { id: "offer_3", label: "¿Tus clientes vuelven o renuevan?", helper: "La retención sostiene el crecimiento.", options: ["No lo sé", "Pocos", "Una parte", "Sí, lo mido"] },
    ],
  };

  return [
    {
      id: "finances", number: "01", title: "Números del negocio", shortTitle: "Finanzas", description: `Preguntas para un negocio de ${businessTypes.find((item) => item.id === type)?.label.toLowerCase() ?? "servicios"}.`,
      questions: [
        { id: "finance_1", label: `¿Sabés cuánto ganás por ${saleUnit}?`, helper: "Después de todos los costos.", options: ["No", "Lo estimo", "Lo calculé", "Sí, lo actualizo"] },
        { id: "finance_2", label: "¿Conocés tus costos mensuales?", helper: "Fijos y variables por separado.", options: ["No", "Solo algunos", "Casi todos", "Sí, los reviso"] },
        { id: "finance_3", label: "¿Separás la plata del negocio?", helper: "Cuenta y gastos separados.", options: ["No", "A veces", "Casi siempre", "Sí, totalmente"] },
      ],
      actions: [marginAction, "Separá costos fijos, variables y gastos personales.", "Proyectá caja para las próximas ocho semanas."],
    },
    {
      id: "sales", number: "02", title: "Ventas y clientes", shortTitle: "Ventas", description: `Adaptado a ventas ${channels.find((item) => item.id === context.channel)?.label.toLowerCase() ?? "del negocio"}.`,
      questions: [
        { id: "sales_1", label: "¿Tenés ventas todas las semanas?", helper: "Buscamos constancia, no un mes aislado.", options: ["No", "Algunas semanas", "Casi todas", "Sí, son previsibles"] },
        { id: "sales_2", ...salesQuestion },
        { id: "sales_3", ...channelQuestion },
      ],
      actions: [
        context.channel === "online" ? "Elegí el canal online que mejor convierte y fijá una meta semanal." : context.channel === "inperson" ? "Registrá ventas por día y horario durante cuatro semanas." : "Compará ventas, margen y esfuerzo de cada canal.",
        context.customer === "business" ? "Asigná fecha y próximo paso a cada propuesta abierta." : "Creá una acción concreta para que los clientes vuelvan.",
        "Registrá oportunidades, ventas y motivos de pérdida cada semana.",
      ],
    },
    {
      id: "offer", number: "03", title: type === "service" ? "Servicio y propuesta" : type === "food" ? "Menú y rentabilidad" : type === "digital" ? "Producto digital" : "Productos y stock", shortTitle: "Oferta", description: "Preguntas específicas para lo que vendés.",
      questions: offerQuestions[type],
      actions: type === "service"
        ? ["Definí alcance, plazo y precio de tus tres servicios principales.", "Medí horas reales de cada trabajo durante un mes.", "Creá una propuesta base que puedas adaptar sin empezar de cero."]
        : type === "food"
          ? ["Costeá cada producto incluyendo desperdicio y empaque.", "Marcá los productos de alto margen que querés impulsar.", "Revisá precios cada vez que cambien insumos importantes."]
          : type === "digital"
            ? ["Medí conversión y costo de adquisición por canal.", "Elegí una mejora que aumente activación o recompra.", "Compará ingresos recurrentes con cancelaciones cada mes."]
            : ["Ordená productos por ventas, margen y rotación.", "Definí mínimos de stock para los productos clave.", "Creá una regla simple para actualizar precios."],
    },
    {
      id: "operations", number: "04", title: isTeam ? "Equipo y operación" : "Tiempo y operación", shortTitle: "Operaciones", description: isTeam ? "Cómo trabaja y entrega el equipo." : "Cómo usás tu tiempo y repetís el trabajo.",
      questions: [
        { id: "ops_1", label: isTeam ? "¿Cada persona sabe qué debe hacer?" : "¿Tu semana tiene bloques de trabajo?", helper: isTeam ? "Responsables y resultados claros." : "Vender, entregar y administrar.", options: ["No", "A veces", "Casi siempre", "Sí, está claro"] },
        { id: "ops_2", label: "¿Los pasos importantes están escritos?", helper: "Para repetir sin depender de memoria.", options: ["No", "Algunos", "Casi todos", "Sí, se actualizan"] },
        { id: "ops_3", label: "¿Entregás a tiempo?", helper: "Sin correr ni perder calidad.", options: ["Pocas veces", "A veces", "Casi siempre", "Sí, de forma estable"] },
      ],
      actions: isTeam
        ? ["Definí responsable y resultado esperado para cada proceso clave.", "Documentá el proceso que más errores genera.", "Revisá capacidad y entregas pendientes una vez por semana."]
        : ["Separá bloques semanales para vender, entregar y administrar.", "Documentá la tarea repetitiva que más tiempo te consume.", "Definí un límite de trabajos o pedidos por semana."],
    },
    {
      id: "direction", number: "05", title: "Objetivo y control", shortTitle: "Dirección", description: `Enfocado en tu objetivo: ${goals.find((item) => item.id === context.goal)?.label.toLowerCase() ?? "mejorar"}.`,
      questions: [
        { id: "direction_1", label: "¿Tu objetivo tiene número y fecha?", helper: "Debe poder medirse.", options: ["No", "Solo una idea", "Tiene un número", "Sí, número y fecha"] },
        { id: "direction_2", label: "¿Revisás resultados cada semana?", helper: "Ventas, caja y una métrica clave.", options: ["No", "A veces", "Casi siempre", "Sí, el mismo día"] },
        { id: "direction_3", label: "¿Sabés qué vas a dejar de hacer?", helper: "El foco también necesita límites.", options: ["No", "Lo pienso", "Tengo una lista", "Sí, ya lo decidí"] },
      ],
      actions: [
        `Convertí “${goals.find((item) => item.id === context.goal)?.label ?? "mejorar"}” en una meta con número y fecha.`,
        "Revisá ventas, caja y una métrica clave el mismo día cada semana.",
        "Pausá una tarea o proyecto que no acerque a la meta.",
      ],
    },
  ];
}

const defaultContext: BusinessContext = { businessType: "", channel: "", customer: "", team: "", stage: "", goal: "", currency: "ARS", revenue: "", fixedCosts: "", variableCosts: "", targetRevenue: "" };

function clampStep(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 7 ? parsed : 0;
}

function getMaturity(score: number) {
  if (score >= 82) return { title: "Sistema listo para escalar", text: "Tu base es consistente. El desafío es crecer sin perder visibilidad ni calidad.", tone: "Excelente" };
  if (score >= 64) return { title: "Negocio en consolidación", text: "Ya existen fundamentos claros. Enfocar dos áreas puede acelerar el próximo salto.", tone: "Buen momento" };
  if (score >= 43) return { title: "Base con oportunidades", text: "El negocio funciona, pero todavía depende de esfuerzo e intuición en puntos importantes.", tone: "Hay potencial" };
  return { title: "Etapa de orden y validación", text: "No necesitás resolver todo junto. Una secuencia inteligente puede darte estabilidad rápidamente.", tone: "Empezá simple" };
}

function parseAmount(value: string) {
  const normalized = value.replace(/\D/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.max(0, amount) : 0;
}

function formatAmountInput(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15);
  if (!digits) return "";
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(Number(digits));
}

function formatMoney(value: number, currency: "ARS" | "USD") {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function BusinessPulse() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [context, setContext] = useState<BusinessContext>(defaultContext);
  const [hydrated, setHydrated] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(!hasSupabaseConfig());
  const [savedDiagnosticId, setSavedDiagnosticId] = useState<string | null>(null);
  const [savingDiagnostic, setSavingDiagnostic] = useState(false);
  const [diagnosticMessage, setDiagnosticMessage] = useState("");
  const dimensions = buildDimensions(context);

  useEffect(() => {
    let savedStep = 0;
    let savedAnswers: AnswerMap = {};
    let savedContext: BusinessContext = defaultContext;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { step?: unknown; answers?: AnswerMap; context?: Partial<BusinessContext> };
        savedStep = clampStep(parsed.step);
        savedAnswers = parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {};
        savedContext = { ...defaultContext, ...parsed.context };
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    queueMicrotask(() => {
      setStep(savedStep);
      setAnswers(savedAnswers);
      setContext(savedContext);
      setShowResume(savedStep > 0);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated || step === 7) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers, context }));
  }, [answers, context, hydrated, step]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUserId(data.session?.user.id ?? null);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const dimensionScores = Object.fromEntries(dimensions.map((dimension) => {
    const total = dimension.questions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
    return [dimension.id, Math.round((total / (dimension.questions.length * 3)) * 100)];
  })) as Record<DimensionId, number>;

  const overallScore = Math.round(
    dimensionScores.finances * 0.25
    + dimensionScores.sales * 0.22
    + dimensionScores.offer * 0.18
    + dimensionScores.operations * 0.18
    + dimensionScores.direction * 0.17,
  );
  const priorities = [...dimensions].sort((a, b) => dimensionScores[a.id] - dimensionScores[b.id]).slice(0, 3);
  const maturity = getMaturity(overallScore);
  const actionPlan = [
    { week: "Semana 1", dimension: priorities[0], action: priorities[0].actions[0], tag: "Prioridad crítica" },
    { week: "Semana 2", dimension: priorities[1], action: priorities[1].actions[0], tag: "Segundo frente" },
    { week: "Semana 3", dimension: priorities[2], action: priorities[2].actions[0], tag: "Fortalecer base" },
    { week: "Semana 4", dimension: priorities[0], action: priorities[0].actions[1], tag: "Medir y ajustar" },
  ];

  const revenue = parseAmount(context.revenue);
  const fixedCosts = parseAmount(context.fixedCosts);
  const variableCosts = parseAmount(context.variableCosts);
  const targetRevenue = parseAmount(context.targetRevenue);
  const operatingResult = revenue - fixedCosts - variableCosts;
  const netMargin = revenue > 0 ? (operatingResult / revenue) * 100 : null;
  const contributionRate = revenue > 0 ? (revenue - variableCosts) / revenue : 0;
  const breakEven = contributionRate > 0 ? fixedCosts / contributionRate : null;
  const revenueGap = targetRevenue > revenue ? targetRevenue - revenue : 0;
  const growthNeeded = revenue > 0 && targetRevenue > revenue ? ((targetRevenue / revenue) - 1) * 100 : 0;
  const hasNumbers = revenue > 0 && (fixedCosts > 0 || variableCosts > 0);

  const currentDimension = step >= 1 && step <= 5 ? dimensions[step - 1] : null;
  const currentComplete = currentDimension ? currentDimension.questions.every((question) => answers[question.id] !== undefined) : true;
  const contextComplete = Boolean(context.businessType && context.channel && context.customer && context.team && context.stage && context.goal);

  useEffect(() => {
    if (!hydrated || !authReady) return;
    const reportId = new URLSearchParams(window.location.search).get("report");
    if (!reportId) return;
    if (!userId) {
      queueMicrotask(() => setDiagnosticMessage("Iniciá sesión para abrir este diagnóstico guardado."));
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;
    let active = true;
    queueMicrotask(() => setDiagnosticMessage("Abriendo tu diagnóstico guardado..."));

    void supabase
      .from("business_diagnostics")
      .select("id,context,answers")
      .eq("id", reportId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setDiagnosticMessage("No encontramos ese diagnóstico o no pertenece a tu cuenta.");
          return;
        }
        const storedContext = data.context && typeof data.context === "object" ? data.context as Partial<BusinessContext> : {};
        const storedAnswers = data.answers && typeof data.answers === "object" ? data.answers as AnswerMap : {};
        setContext({ ...defaultContext, ...storedContext });
        setAnswers(storedAnswers);
        setSavedDiagnosticId(data.id);
        setStep(7);
        setShowResume(false);
        setDiagnosticMessage("Diagnóstico recuperado desde tu cuenta.");
      });

    return () => {
      active = false;
    };
  }, [authReady, hydrated, userId]);

  function updateProfile(field: keyof Pick<BusinessContext, "businessType" | "channel" | "customer" | "team" | "stage" | "goal">, value: string) {
    setContext((current) => ({ ...current, [field]: value }));
    if (Object.keys(answers).length) setAnswers({});
  }

  function goTo(nextStep: number) {
    setStep(nextStep);
    setShowResume(false);
    requestAnimationFrame(() => document.getElementById("diagnostic-top")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function saveDiagnostic() {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      router.push("/cuenta?next=%2Fdiagnostico");
      return;
    }

    setSavingDiagnostic(true);
    setDiagnosticMessage(savedDiagnosticId ? "Actualizando tu diagnóstico..." : "Guardando tu diagnóstico...");

    const businessLabel = businessTypes.find((item) => item.id === context.businessType)?.label ?? "Negocio";
    const payload = {
      user_id: userId,
      title: `${businessLabel} · ${maturity.title}`,
      context,
      answers,
      scores: dimensionScores,
      financials: {
        currency: context.currency,
        revenue,
        fixed_costs: fixedCosts,
        variable_costs: variableCosts,
        operating_result: operatingResult,
        net_margin: netMargin,
        break_even: breakEven,
        target_revenue: targetRevenue,
        revenue_gap: revenueGap,
        growth_needed: growthNeeded,
      },
      action_plan: actionPlan.map((item) => ({
        week: item.week,
        dimension: item.dimension.id,
        dimension_title: item.dimension.shortTitle,
        action: item.action,
      })),
      overall_score: overallScore,
      maturity_title: maturity.title,
      application_version: 3,
    };

    const result = savedDiagnosticId
      ? await supabase.from("business_diagnostics").update(payload).eq("id", savedDiagnosticId).select("id").single()
      : await supabase.from("business_diagnostics").insert(payload).select("id").single();

    setSavingDiagnostic(false);
    if (result.error || !result.data) {
      setDiagnosticMessage(
        result.error?.code === "PGRST205"
          ? "La cuenta está conectada, pero todavía falta activar la tabla de diagnósticos en Supabase."
          : "No pudimos guardar el diagnóstico. Revisá tu conexión y volvé a intentar.",
      );
      return;
    }

    setSavedDiagnosticId(result.data.id);
    window.history.replaceState({}, "", `/diagnostico?report=${result.data.id}`);
    setDiagnosticMessage(savedDiagnosticId ? "Diagnóstico actualizado en tu cuenta." : "Diagnóstico guardado en tu cuenta.");
  }

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, "", "/diagnostico");
    setAnswers({});
    setContext(defaultContext);
    setStep(0);
    setShowResume(false);
    setSavedDiagnosticId(null);
    setDiagnosticMessage("");
  }

  if (!hydrated) {
    return <div className="min-h-[580px] animate-pulse rounded-[2rem] border border-[#d5e5db] bg-white" aria-label="Preparando diagnóstico" />;
  }

  if (step === 7) {
    return (
      <section id="diagnostic-top" aria-live="polite" className="diagnostic-result overflow-hidden rounded-[2rem] border border-[#bcd8c7] bg-white shadow-[0_28px_90px_rgba(12,57,38,.13)]">
        <div className="grid lg:grid-cols-[.7fr_1.3fr]">
          <aside className="relative overflow-hidden bg-[#123d2b] p-7 text-white sm:p-10">
            <div className="absolute -right-20 -top-24 size-64 rounded-full border-[48px] border-white/[.045]" />
            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9ce1b8]">Índice Growtella</p>
              <div className="mt-8 flex items-end gap-2"><span className="text-8xl font-black tracking-[-.09em]">{overallScore}</span><span className="pb-3 text-lg font-bold text-white/35">/100</span></div>
              <span className="mt-5 inline-flex rounded-full border border-white/12 bg-white/[.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-[#b7eac9]">{maturity.tone}</span>
              <h2 className="mt-5 text-3xl font-black tracking-[-.04em]">{maturity.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/65">{maturity.text}</p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-white/40">Perfil evaluado</p>
                <p className="mt-3 text-sm font-bold text-white/80">{businessTypes.find((item) => item.id === context.businessType)?.label} · {channels.find((item) => item.id === context.channel)?.label}</p>
                <p className="mt-1 text-xs text-white/45">{customers.find((item) => item.id === context.customer)?.label} · {teams.find((item) => item.id === context.team)?.label}</p>
                <p className="mt-3 text-xs font-bold text-[#aee5c2]">Objetivo: {goals.find((item) => item.id === context.goal)?.label}</p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="eyebrow">Mapa de madurez</p><h3 className="mt-2 text-2xl font-black tracking-[-.035em] text-[#153f2e]">Dónde estás fuerte y dónde actuar</h3></div>
              <p className="text-xs text-[#71837b]">Basado en 15 indicadores</p>
            </div>
            <div className="mt-7 grid gap-4">
              {dimensions.map((dimension) => (
                <div key={dimension.id} className="grid gap-2 sm:grid-cols-[8rem_1fr_3rem] sm:items-center">
                  <span className="text-xs font-black text-[#365548]">{dimension.shortTitle}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#edf3ef]"><div className={`h-full rounded-full ${dimensionScores[dimension.id] < 45 ? "bg-[#d39b52]" : dimensionScores[dimension.id] < 70 ? "bg-[#72b68d]" : "bg-[#26875a]"}`} style={{ width: `${dimensionScores[dimension.id]}%` }} /></div>
                  <span className="text-right font-mono text-xs font-black text-[#446156]">{dimensionScores[dimension.id]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {hasNumbers && (
          <div className="border-t border-[#e1ebe5] bg-[#f6faf7] p-6 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Foto financiera mensual</p><h3 className="mt-2 text-2xl font-black tracking-tight text-[#153f2e]">Los números detrás del diagnóstico</h3></div><span className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] ${operatingResult >= 0 ? "bg-[#dff4e7] text-[#216e49]" : "bg-[#fae6db] text-[#9a4d28]"}`}>{operatingResult >= 0 ? "Resultado positivo" : "Atención inmediata"}</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-[#dce8e0] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Ventas</p><p className="mt-3 text-xl font-black text-[#153f2e]">{formatMoney(revenue, context.currency)}</p></article>
              <article className="rounded-2xl border border-[#dce8e0] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Resultado</p><p className={`mt-3 text-xl font-black ${operatingResult >= 0 ? "text-[#26734f]" : "text-[#a54e2c]"}`}>{formatMoney(operatingResult, context.currency)}</p></article>
              <article className="rounded-2xl border border-[#dce8e0] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Margen neto</p><p className="mt-3 text-xl font-black text-[#153f2e]">{netMargin?.toFixed(1)}%</p></article>
              <article className="rounded-2xl border border-[#dce8e0] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Punto de equilibrio</p><p className="mt-3 text-xl font-black text-[#153f2e]">{breakEven ? formatMoney(breakEven, context.currency) : "Revisar costos"}</p></article>
            </div>
            {targetRevenue > 0 && (
              <div className={`mt-4 rounded-2xl border p-5 ${revenueGap > 0 ? "border-[#e3d3b5] bg-[#fffaf0]" : "border-[#bfdac9] bg-[#eff8f2]"}`}>
                <p className="text-[10px] font-black uppercase tracking-[.13em] text-[#71837b]">Meta mensual</p>
                <p className="mt-2 text-sm font-bold text-[#294739]">
                  {revenueGap > 0
                    ? `Para llegar a ${formatMoney(targetRevenue, context.currency)} faltan ${formatMoney(revenueGap, context.currency)} (${growthNeeded.toFixed(1)}% más ventas).`
                    : `La venta actual ya alcanza la meta de ${formatMoney(targetRevenue, context.currency)}.`}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-[#e1ebe5] p-6 sm:p-10">
          <div className="max-w-3xl"><p className="eyebrow">Plan personalizado de 30 días</p><h3 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#153f2e]">Tres prioridades, cuatro semanas, cero ruido.</h3><p className="mt-3 leading-7 text-[#5f7369]">El orden se define por tus áreas con menor puntaje. Completá una acción antes de agregar otra.</p></div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {actionPlan.map((item, index) => (
              <article key={item.week} className={`rounded-2xl border p-5 ${index === 0 ? "border-[#a8cdb7] bg-[#edf8f1]" : "border-[#dce8e0] bg-white"}`}>
                <div className="flex items-center justify-between"><span className="font-mono text-xs font-black text-[#3a865f]">0{index + 1}</span><span className="text-[9px] font-black uppercase tracking-[.11em] text-[#7b8c84]">{item.tag}</span></div>
                <p className="mt-5 text-xs font-black text-[#2c7651]">{item.week} · {item.dimension.shortTitle}</p>
                <p className="mt-3 text-sm font-bold leading-6 text-[#294739]">{item.action}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e1ebe5] bg-[#fbfcfb] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <p className="text-xs font-black text-[#294739]">{savedDiagnosticId ? "Guardado en tu cuenta" : "Privado por diseño"}</p>
            <p className="mt-1 text-xs text-[#71837b]">{savedDiagnosticId ? "Solo tu usuario puede consultar o modificar este informe." : "Permanece en este navegador hasta que elijas guardarlo en tu cuenta."}</p>
            {diagnosticMessage && <p role="status" className="mt-2 text-xs font-bold text-[#2b7651]">{diagnosticMessage}</p>}
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button type="button" onClick={() => window.print()} className="focus-ring rounded-full border border-[#c9dcd1] bg-white px-4 py-2.5 text-xs font-black text-[#234638] hover:bg-[#f3f8f5]">Guardar informe en PDF</button>
            {userId ? (
              <button type="button" disabled={savingDiagnostic} onClick={() => void saveDiagnostic()} className="focus-ring rounded-full border border-[#9fc8af] bg-[#eaf7ef] px-4 py-2.5 text-xs font-black text-[#226b48] hover:bg-[#dff2e6] disabled:cursor-wait disabled:opacity-60">
                {savingDiagnostic ? "Guardando..." : savedDiagnosticId ? "Actualizar en mi cuenta" : "Guardar en mi cuenta"}
              </button>
            ) : (
              <a href="/cuenta?next=%2Fdiagnostico" className="focus-ring rounded-full border border-[#9fc8af] bg-[#eaf7ef] px-4 py-2.5 text-xs font-black text-[#226b48] hover:bg-[#dff2e6]">Iniciar sesión para guardar</a>
            )}
            <button type="button" onClick={reset} className="focus-ring rounded-full bg-[#153f2e] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0d3223]">Hacer uno nuevo</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnostic-top" className="overflow-hidden rounded-[2rem] border border-[#c7ddd0] bg-white shadow-[0_28px_90px_rgba(12,57,38,.11)]">
      <div className="grid lg:grid-cols-[15rem_1fr]">
        <aside className="border-b border-[#dce8e0] bg-[#123d2b] p-6 text-white lg:border-b-0 lg:border-r lg:p-7">
          <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#9ce1b8]">Diagnóstico 360°</p>
          <h2 className="mt-3 text-xl font-black tracking-tight">Tu negocio, sin puntos ciegos.</h2>
          <p className="mt-3 text-xs leading-5 text-white/55">15 indicadores + números opcionales + plan de 30 días.</p>

          <div className="mt-7 flex gap-1.5 lg:grid lg:gap-2">
            {["Contexto", ...dimensions.map((item) => item.shortTitle), "Números"].map((label, index) => (
              <div key={label} className={`flex-1 rounded-lg px-2 py-2 text-center text-[9px] font-black uppercase tracking-[.08em] lg:flex lg:items-center lg:gap-2 lg:text-left ${step === index ? "bg-white text-[#153f2e]" : step > index ? "bg-white/10 text-[#aee5c2]" : "text-white/32"}`}>
                <span className={`hidden size-5 shrink-0 place-items-center rounded-full text-[9px] lg:grid ${step === index ? "bg-[#dff4e7]" : "bg-white/8"}`}>{step > index ? "✓" : index + 1}</span>
                <span className="hidden lg:inline">{label}</span><span className="lg:hidden">{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 hidden rounded-2xl border border-white/10 bg-white/[.055] p-4 lg:block">
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-white/40">Tu progreso</p>
            <p className="mt-2 text-2xl font-black">{Math.round((step / 7) * 100)}%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#8ee2b0] transition-all" style={{ width: `${(step / 7) * 100}%` }} /></div>
            <p className="mt-3 text-[10px] leading-4 text-white/42">El avance se guarda automáticamente en este dispositivo.</p>
          </div>
        </aside>

        <div className="min-h-[620px] p-6 sm:p-9 lg:p-10">
          {showResume && <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#cfe1d6] bg-[#eff8f2] px-4 py-3 text-xs text-[#3f6253]"><span><strong>Continuamos donde quedaste.</strong> Tu avance estaba guardado.</span><button type="button" onClick={reset} className="shrink-0 font-black text-[#26734f] underline underline-offset-4">Empezar de cero</button></div>}

          {step === 0 && (
            <div>
              <p className="eyebrow">Primero entendemos tu negocio</p>
              <h3 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.045em] text-[#153f2e] sm:text-4xl">¿Qué vendés y cómo funciona?</h3>
              <p className="mt-4 max-w-2xl leading-7 text-[#60736a]">Tus respuestas cambian las preguntas siguientes. Un negocio de servicios no se evalúa igual que un local gastronómico.</p>

              <fieldset className="mt-8">
                <legend className="text-sm font-black text-[#294739]">1. ¿Qué vendés?</legend>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {businessTypes.map((item) => (
                    <label key={item.id} className={`cursor-pointer rounded-2xl border p-4 transition ${context.businessType === item.id ? "border-[#2c8158] bg-[#eaf7ef] shadow-[inset_0_0_0_1px_#2c8158]" : "border-[#dce8e0] hover:border-[#a9c9b6] hover:bg-[#f8fbf9]"}`}>
                      <input type="radio" name="businessType" value={item.id} checked={context.businessType === item.id} onChange={() => updateProfile("businessType", item.id)} className="sr-only" />
                      <span className="grid size-9 place-items-center rounded-xl bg-white text-[#26734f] shadow-sm">{item.icon}</span><span className="mt-3 block text-sm font-black text-[#244437]">{item.label}</span><span className="mt-1 block text-[10px] leading-4 text-[#71837b]">{item.detail}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <fieldset>
                  <legend className="text-sm font-black text-[#294739]">2. ¿Cómo vendés?</legend>
                  <div className="mt-3 grid gap-2">
                    {channels.map((item) => <label key={item.id} className={`cursor-pointer rounded-xl border px-4 py-3 text-xs font-bold transition ${context.channel === item.id ? "border-[#2c8158] bg-[#eaf7ef] text-[#18583a]" : "border-[#dce8e0] text-[#5c7066] hover:bg-[#f8fbf9]"}`}><input type="radio" name="channel" value={item.id} checked={context.channel === item.id} onChange={() => updateProfile("channel", item.id)} className="sr-only" />{item.label}</label>)}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-black text-[#294739]">3. ¿A quién le vendés?</legend>
                  <div className="mt-3 grid gap-2">
                    {customers.map((item) => <label key={item.id} className={`cursor-pointer rounded-xl border px-4 py-3 text-xs font-bold transition ${context.customer === item.id ? "border-[#2c8158] bg-[#eaf7ef] text-[#18583a]" : "border-[#dce8e0] text-[#5c7066] hover:bg-[#f8fbf9]"}`}><input type="radio" name="customer" value={item.id} checked={context.customer === item.id} onChange={() => updateProfile("customer", item.id)} className="sr-only" />{item.label}</label>)}
                  </div>
                </fieldset>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <fieldset>
                  <legend className="text-sm font-black text-[#294739]">4. ¿Quién trabaja?</legend>
                  <div className="mt-3 grid gap-2">
                    {teams.map((item) => <label key={item.id} className={`cursor-pointer rounded-xl border px-4 py-3 text-xs font-bold transition ${context.team === item.id ? "border-[#2c8158] bg-[#eaf7ef] text-[#18583a]" : "border-[#dce8e0] text-[#5c7066] hover:bg-[#f8fbf9]"}`}><input type="radio" name="team" value={item.id} checked={context.team === item.id} onChange={() => updateProfile("team", item.id)} className="sr-only" />{item.label}</label>)}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-black text-[#294739]">5. ¿En qué etapa estás?</legend>
                  <div className="mt-3 grid gap-2">
                    {stages.map((item) => <label key={item.id} className={`cursor-pointer rounded-xl border px-4 py-3 text-xs font-bold transition ${context.stage === item.id ? "border-[#2c8158] bg-[#eaf7ef] text-[#18583a]" : "border-[#dce8e0] text-[#5c7066] hover:bg-[#f8fbf9]"}`}><input type="radio" name="stage" value={item.id} checked={context.stage === item.id} onChange={() => updateProfile("stage", item.id)} className="sr-only" />{item.label}</label>)}
                  </div>
                </fieldset>
              </div>

              <fieldset className="mt-7">
                <legend className="text-sm font-black text-[#294739]">6. ¿Qué querés mejorar primero?</legend>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {goals.map((item) => (
                    <label key={item.id} className={`cursor-pointer rounded-xl border p-4 text-center transition ${context.goal === item.id ? "border-[#2c8158] bg-[#eaf7ef] text-[#18583a]" : "border-[#dce8e0] text-[#5c7066] hover:bg-[#f8fbf9]"}`}>
                      <input type="radio" name="goal" value={item.id} checked={context.goal === item.id} onChange={() => updateProfile("goal", item.id)} className="sr-only" />
                      <span className="mx-auto grid size-8 place-items-center rounded-lg bg-white text-[#26734f] shadow-sm">{item.icon}</span><span className="mt-2 block text-xs font-black leading-5">{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {context.businessType && context.channel && context.customer && context.team && (
                <div className="mt-7 rounded-2xl border border-[#cde0d4] bg-[#f1f8f4] p-4 text-xs leading-5 text-[#456355]"><strong>Perfil:</strong> {businessTypes.find((item) => item.id === context.businessType)?.label} · {channels.find((item) => item.id === context.channel)?.label} · {customers.find((item) => item.id === context.customer)?.label} · {teams.find((item) => item.id === context.team)?.label}</div>
              )}

              <div className="mt-9 flex items-center justify-between gap-4"><p className="text-xs text-[#7b8b83]">Faltan {6 - [context.businessType, context.channel, context.customer, context.team, context.stage, context.goal].filter(Boolean).length} respuestas</p><button type="button" disabled={!contextComplete} onClick={() => goTo(1)} className="focus-ring rounded-full bg-[#153f2e] px-6 py-3.5 text-sm font-black text-white hover:bg-[#0d3223] disabled:cursor-not-allowed disabled:opacity-35">Crear preguntas para mi negocio →</button></div>
            </div>
          )}

          {currentDimension && (
            <div>
              <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e5f4eb] font-mono text-xs font-black text-[#26734f]">{currentDimension.number}</span><div><p className="eyebrow">Dimensión {step} de 5</p><h3 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#153f2e]">{currentDimension.title}</h3><p className="mt-2 text-sm leading-6 text-[#667970]">{currentDimension.description}</p></div></div>
              <div className="mt-7 divide-y divide-[#e4ede7] border-y border-[#e4ede7]">
                {currentDimension.questions.map((question, questionIndex) => (
                  <fieldset key={question.id} className="py-6">
                    <legend className="w-full"><span className="flex gap-3"><span className="font-mono text-[10px] font-black text-[#4a9870]">0{questionIndex + 1}</span><span><span className="block text-sm font-black text-[#294739]">{question.label}</span><span className="mt-1 block text-xs leading-5 text-[#71837b]">{question.helper}</span></span></span></legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {question.options.map((option, value) => (
                        <label key={option} className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-[11px] font-bold leading-4 transition ${answers[question.id] === value ? "border-[#2c8158] bg-[#e7f5ec] text-[#18583a] shadow-[inset_0_0_0_1px_#2c8158]" : "border-[#d9e6de] text-[#5c7066] hover:border-[#a9c9b6] hover:bg-[#f7faf8]"}`}>
                          <input className="sr-only" type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: value }))} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <div className="mt-7 flex items-center justify-between gap-3"><button type="button" onClick={() => goTo(step - 1)} className="focus-ring rounded-full border border-[#ccdcd3] px-5 py-3 text-sm font-black text-[#365548] hover:bg-[#f5f9f7]">← Volver</button><button type="button" disabled={!currentComplete} onClick={() => goTo(step + 1)} className="focus-ring rounded-full bg-[#153f2e] px-6 py-3 text-sm font-black text-white hover:bg-[#0d3223] disabled:cursor-not-allowed disabled:opacity-35">Continuar →</button></div>
            </div>
          )}

          {step === 6 && (
            <div>
              <p className="eyebrow">Capa financiera opcional</p>
              <h3 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.045em] text-[#153f2e] sm:text-4xl">Sumá los números de un mes normal.</h3>
              <p className="mt-4 max-w-2xl leading-7 text-[#60736a]">Escribí solo números. Growtella agrega los puntos automáticamente: si ingresás <strong>4000000</strong>, vas a ver <strong>4.000.000</strong>.</p>

              <div className="mt-7 flex w-fit rounded-xl bg-[#eef5f0] p-1" role="group" aria-label="Moneda">
                {(["ARS", "USD"] as const).map((currency) => <button key={currency} type="button" onClick={() => setContext((current) => ({ ...current, currency }))} className={`rounded-lg px-4 py-2 text-xs font-black ${context.currency === currency ? "bg-white text-[#153f2e] shadow-sm" : "text-[#71837b]"}`}>{currency}</button>)}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {([
                  { key: "revenue", label: "Ventas mensuales", helper: "Lo facturado en un mes normal" },
                  { key: "fixedCosts", label: "Costos fijos", helper: "Alquiler, sueldos y servicios" },
                  { key: "variableCosts", label: "Costos variables", helper: "Insumos y comisiones por venta" },
                  { key: "targetRevenue", label: "Meta mensual", helper: "Cuánto querés vender por mes" },
                ] as const).map((field) => (
                  <label key={field.key} className="rounded-2xl border border-[#dce8e0] bg-[#f9fbfa] p-4">
                    <span className="text-xs font-black text-[#294739]">{field.label}</span><span className="mt-1 block min-h-8 text-[10px] leading-4 text-[#7a8b83]">{field.helper}</span>
                    <span className="mt-4 flex items-center gap-2 rounded-xl border border-[#d3e1d8] bg-white px-3 focus-within:border-[#75a98c] focus-within:ring-2 focus-within:ring-[#d9eee2]"><span className="text-xs font-black text-[#4a8067]">{context.currency === "ARS" ? "$" : "US$"}</span><input inputMode="numeric" value={context[field.key]} onChange={(event) => setContext((current) => ({ ...current, [field.key]: formatAmountInput(event.target.value) }))} placeholder="Ej: 4.000.000" aria-label={field.label} className="min-w-0 flex-1 bg-transparent py-3 text-sm font-black tabular-nums text-[#153f2e] outline-none placeholder:font-medium placeholder:text-[#a1afa8]" /></span>
                  </label>
                ))}
              </div>

              {hasNumbers && <div className={`mt-5 rounded-2xl border p-4 text-sm ${operatingResult >= 0 ? "border-[#bcdac8] bg-[#eef8f2] text-[#285c43]" : "border-[#efd2c3] bg-[#fff5ef] text-[#8d482a]"}`}><strong>Lectura rápida:</strong> con estos datos, el resultado mensual estimado es {formatMoney(operatingResult, context.currency)} y el margen es {netMargin?.toFixed(1)}%.</div>}

              <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => goTo(5)} className="focus-ring rounded-full border border-[#ccdcd3] px-5 py-3 text-sm font-black text-[#365548] hover:bg-[#f5f9f7]">← Volver</button><div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => goTo(7)} className="focus-ring rounded-full border border-[#bdd4c6] px-5 py-3 text-sm font-black text-[#2b6448] hover:bg-[#f1f8f4]">Omitir números</button><button type="button" onClick={() => goTo(7)} className="focus-ring rounded-full bg-[#153f2e] px-6 py-3 text-sm font-black text-white hover:bg-[#0d3223]">Generar mi informe →</button></div></div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-[#e3ece6] bg-[#fafcfb] px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[.1em] text-[#819188]">Gratis · Sin cuenta · Sin IA · Datos privados en tu dispositivo</div>
    </section>
  );
}
