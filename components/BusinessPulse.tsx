"use client";

import { useEffect, useMemo, useState } from "react";

type AnswerMap = Record<string, number>;
type DimensionId = "finances" | "sales" | "offer" | "operations" | "direction";
type BusinessContext = {
  stage: string;
  goal: string;
  currency: "ARS" | "USD";
  revenue: string;
  fixedCosts: string;
  variableCosts: string;
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

const STORAGE_KEY = "growtella-business-diagnostic-v2";

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

const dimensions: readonly Dimension[] = [
  {
    id: "finances",
    number: "01",
    title: "Salud financiera",
    shortTitle: "Finanzas",
    description: "Mide cuánto control tenés sobre precios, rentabilidad y caja.",
    questions: [
      { id: "margin", label: "¿Conocés el margen real de lo que vendés?", helper: "No alcanza con saber cuánto entra: importa cuánto queda.", options: ["No lo conozco", "Tengo una estimación", "Lo calculo a veces", "Lo sigo todos los meses"] },
      { id: "cash", label: "¿Cuánto podés anticipar tu caja?", helper: "La previsión evita que un buen negocio se quede sin aire.", options: ["Veo día a día", "Anticipo algunas semanas", "Proyecto un mes", "Proyecto 3 meses o más"] },
      { id: "pricing", label: "¿Cómo definís tus precios?", helper: "Un precio sano cubre costos, tiempo, riesgo y ganancia.", options: ["Copio o improviso", "Sumo los costos básicos", "Incluyo margen y tiempo", "Reviso y pruebo regularmente"] },
    ],
    actions: ["Calculá el margen de tus tres productos o servicios principales.", "Armá una proyección simple de caja para las próximas ocho semanas.", "Definí un criterio de revisión de precios y una fecha para aplicarlo."],
  },
  {
    id: "sales",
    number: "02",
    title: "Motor comercial",
    shortTitle: "Ventas",
    description: "Evalúa si tus ventas dependen de la suerte o de un sistema repetible.",
    questions: [
      { id: "leads", label: "¿Generás oportunidades nuevas cada semana?", helper: "Un flujo constante reduce la ansiedad de empezar de cero.", options: ["Solo cuando necesito vender", "De forma irregular", "Casi todas las semanas", "Tengo un sistema constante"] },
      { id: "conversion", label: "¿Conocés tu tasa de conversión?", helper: "Medir cuántas conversaciones terminan en venta permite mejorar.", options: ["No la mido", "Tengo una idea", "La reviso a veces", "La sigo por canal y período"] },
      { id: "followup", label: "¿Cómo hacés seguimiento de potenciales clientes?", helper: "Muchas ventas se pierden por falta de seguimiento, no por falta de interés.", options: ["Depende de mi memoria", "Uso notas o mensajes", "Tengo una lista ordenada", "Tengo etapas y próximos pasos"] },
    ],
    actions: ["Elegí un canal principal y fijá una meta semanal de oportunidades.", "Registrá conversaciones, propuestas y ventas durante cuatro semanas.", "Creá una secuencia de seguimiento con fecha y próximo paso para cada contacto."],
  },
  {
    id: "offer",
    number: "03",
    title: "Oferta y cliente",
    shortTitle: "Oferta",
    description: "Analiza qué tan fácil es entender, elegir y recomendar lo que vendés.",
    questions: [
      { id: "customer", label: "¿Tenés claro cuál es tu mejor tipo de cliente?", helper: "Hablarle a todos suele hacer que nadie se sienta elegido.", options: ["Le vendo a cualquiera", "Tengo una idea amplia", "Definí un perfil concreto", "Sé quién compra y por qué"] },
      { id: "value", label: "¿Tu propuesta se entiende en una frase?", helper: "Una propuesta clara conecta cliente, problema y resultado.", options: ["Me cuesta explicarla", "Necesito bastante contexto", "Se entiende con ejemplos", "Es clara y específica"] },
      { id: "validation", label: "¿Usás la voz del cliente para mejorar?", helper: "Las mejores ofertas se construyen con evidencia, no solo intuición.", options: ["Casi nunca pregunto", "Recibo comentarios sueltos", "Pido feedback", "Registro patrones y los aplico"] },
    ],
    actions: ["Escribí en una frase a quién ayudás, qué resolvés y qué resultado entregás.", "Entrevistá a tres clientes y anotá las palabras exactas que usan.", "Convertí tu servicio en una oferta con alcance, resultado, plazo y precio claros."],
  },
  {
    id: "operations",
    number: "04",
    title: "Operaciones y tiempo",
    shortTitle: "Operaciones",
    description: "Detecta cuánto depende el negocio de tu memoria y esfuerzo diario.",
    questions: [
      { id: "process", label: "¿Tus tareas repetitivas tienen un proceso?", helper: "Documentar lo repetible libera atención para decidir mejor.", options: ["Todo está en mi cabeza", "Tengo notas dispersas", "Documenté lo importante", "Los procesos se revisan y mejoran"] },
      { id: "time", label: "¿Sabés en qué se va tu tiempo?", helper: "Estar ocupado no siempre significa avanzar.", options: ["Reacciono a lo urgente", "Tengo una lista general", "Planifico la semana", "Protejo tiempo por prioridad"] },
      { id: "delivery", label: "¿Cumplís plazos sin correr al final?", helper: "La entrega previsible mejora margen, reputación y capacidad.", options: ["Casi siempre corro", "Depende de la semana", "La mayoría de las veces", "Tengo capacidad y plazos controlados"] },
    ],
    actions: ["Documentá la tarea repetitiva que más tiempo te consume.", "Separá en tu agenda bloques para vender, entregar y mejorar.", "Definí un límite de capacidad semanal y usalo al prometer plazos."],
  },
  {
    id: "direction",
    number: "05",
    title: "Dirección y foco",
    shortTitle: "Dirección",
    description: "Mide si tus decisiones responden a una prioridad concreta.",
    questions: [
      { id: "goal", label: "¿Tenés una meta medible para los próximos 30 días?", helper: "Una buena meta tiene número, fecha y responsable.", options: ["Tengo muchas prioridades", "Tengo una intención", "Tengo una meta definida", "La meta guía mi semana"] },
      { id: "metrics", label: "¿Qué tan seguido revisás indicadores?", helper: "Pocos números relevantes permiten corregir antes.", options: ["No tengo indicadores", "Miro ventas o saldo", "Reviso algunos cada mes", "Tengo un tablero semanal"] },
      { id: "decisions", label: "¿Cómo decidís qué dejar de hacer?", helper: "Crecer también exige decirle que no a lo que distrae.", options: ["Intento hacer todo", "Dejo lo que no llego", "Priorizo según impacto", "Reviso y elimino activamente"] },
    ],
    actions: ["Elegí una meta de 30 días y un indicador que confirme el avance.", "Creá una revisión semanal de 20 minutos con cuatro métricas clave.", "Hacé una lista de tareas y proyectos que vas a pausar este mes."],
  },
];

const defaultContext: BusinessContext = { stage: "", goal: "", currency: "ARS", revenue: "", fixedCosts: "", variableCosts: "" };

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
  const normalized = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.max(0, amount) : 0;
}

function formatMoney(value: number, currency: "ARS" | "USD") {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function BusinessPulse() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [context, setContext] = useState<BusinessContext>(defaultContext);
  const [hydrated, setHydrated] = useState(false);
  const [showResume, setShowResume] = useState(false);

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

  const dimensionScores = useMemo(() => Object.fromEntries(dimensions.map((dimension) => {
    const total = dimension.questions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
    return [dimension.id, Math.round((total / (dimension.questions.length * 3)) * 100)];
  })) as Record<DimensionId, number>, [answers]);

  const overallScore = Math.round(
    dimensionScores.finances * 0.25
    + dimensionScores.sales * 0.22
    + dimensionScores.offer * 0.18
    + dimensionScores.operations * 0.18
    + dimensionScores.direction * 0.17,
  );
  const priorities = [...dimensions].sort((a, b) => dimensionScores[a.id] - dimensionScores[b.id]).slice(0, 3);
  const maturity = getMaturity(overallScore);

  const revenue = parseAmount(context.revenue);
  const fixedCosts = parseAmount(context.fixedCosts);
  const variableCosts = parseAmount(context.variableCosts);
  const operatingResult = revenue - fixedCosts - variableCosts;
  const netMargin = revenue > 0 ? (operatingResult / revenue) * 100 : null;
  const contributionRate = revenue > 0 ? (revenue - variableCosts) / revenue : 0;
  const breakEven = contributionRate > 0 ? fixedCosts / contributionRate : null;
  const hasNumbers = revenue > 0 && (fixedCosts > 0 || variableCosts > 0);

  const currentDimension = step >= 1 && step <= 5 ? dimensions[step - 1] : null;
  const currentComplete = currentDimension ? currentDimension.questions.every((question) => answers[question.id] !== undefined) : true;
  const contextComplete = Boolean(context.stage && context.goal);

  function goTo(nextStep: number) {
    setStep(nextStep);
    setShowResume(false);
    requestAnimationFrame(() => document.getElementById("diagnostic-top")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setContext(defaultContext);
    setStep(0);
    setShowResume(false);
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
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-white/40">Contexto evaluado</p>
                <p className="mt-3 text-sm font-bold text-white/80">{stages.find((item) => item.id === context.stage)?.label}</p>
                <p className="mt-1 text-xs text-white/45">Objetivo: {goals.find((item) => item.id === context.goal)?.label}</p>
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
          </div>
        )}

        <div className="border-t border-[#e1ebe5] p-6 sm:p-10">
          <div className="max-w-3xl"><p className="eyebrow">Plan personalizado de 30 días</p><h3 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#153f2e]">Tres prioridades, cuatro semanas, cero ruido.</h3><p className="mt-3 leading-7 text-[#5f7369]">El orden se define por tus áreas con menor puntaje. Completá una acción antes de agregar otra.</p></div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {[
              { week: "Semana 1", dimension: priorities[0], action: priorities[0].actions[0], tag: "Prioridad crítica" },
              { week: "Semana 2", dimension: priorities[1], action: priorities[1].actions[0], tag: "Segundo frente" },
              { week: "Semana 3", dimension: priorities[2], action: priorities[2].actions[0], tag: "Fortalecer base" },
              { week: "Semana 4", dimension: priorities[0], action: priorities[0].actions[1], tag: "Medir y ajustar" },
            ].map((item, index) => (
              <article key={item.week} className={`rounded-2xl border p-5 ${index === 0 ? "border-[#a8cdb7] bg-[#edf8f1]" : "border-[#dce8e0] bg-white"}`}>
                <div className="flex items-center justify-between"><span className="font-mono text-xs font-black text-[#3a865f]">0{index + 1}</span><span className="text-[9px] font-black uppercase tracking-[.11em] text-[#7b8c84]">{item.tag}</span></div>
                <p className="mt-5 text-xs font-black text-[#2c7651]">{item.week} · {item.dimension.shortTitle}</p>
                <p className="mt-3 text-sm font-bold leading-6 text-[#294739]">{item.action}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e1ebe5] bg-[#fbfcfb] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div><p className="text-xs font-black text-[#294739]">Privado por diseño</p><p className="mt-1 text-xs text-[#71837b]">El cálculo ocurre en tu navegador. Growtella no recibe tus respuestas ni tus números.</p></div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button type="button" onClick={() => window.print()} className="focus-ring rounded-full border border-[#c9dcd1] bg-white px-4 py-2.5 text-xs font-black text-[#234638] hover:bg-[#f3f8f5]">Guardar informe en PDF</button>
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
              <p className="eyebrow">Antes de medir</p>
              <h3 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.045em] text-[#153f2e] sm:text-4xl">Contanos en qué momento está tu negocio.</h3>
              <p className="mt-4 max-w-2xl leading-7 text-[#60736a]">No pedimos nombre, email ni datos personales. Este contexto hace que el plan final sea más relevante.</p>

              <fieldset className="mt-8">
                <legend className="text-sm font-black text-[#294739]">Etapa actual</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {stages.map((stage) => (
                    <label key={stage.id} className={`cursor-pointer rounded-2xl border p-4 transition ${context.stage === stage.id ? "border-[#2c8158] bg-[#eaf7ef] shadow-[inset_0_0_0_1px_#2c8158]" : "border-[#dce8e0] hover:border-[#a9c9b6] hover:bg-[#f8fbf9]"}`}>
                      <input type="radio" name="stage" value={stage.id} checked={context.stage === stage.id} onChange={() => setContext((current) => ({ ...current, stage: stage.id }))} className="sr-only" />
                      <span className="font-black text-[#244437]">{stage.label}</span><span className="mt-1 block text-xs text-[#71837b]">{stage.detail}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7">
                <legend className="text-sm font-black text-[#294739]">Objetivo principal de los próximos 90 días</legend>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {goals.map((goal) => (
                    <label key={goal.id} className={`cursor-pointer rounded-2xl border p-4 text-center transition ${context.goal === goal.id ? "border-[#2c8158] bg-[#eaf7ef] shadow-[inset_0_0_0_1px_#2c8158]" : "border-[#dce8e0] hover:border-[#a9c9b6] hover:bg-[#f8fbf9]"}`}>
                      <input type="radio" name="goal" value={goal.id} checked={context.goal === goal.id} onChange={() => setContext((current) => ({ ...current, goal: goal.id }))} className="sr-only" />
                      <span className="mx-auto grid size-9 place-items-center rounded-xl bg-white text-[#26734f] shadow-sm">{goal.icon}</span><span className="mt-3 block text-xs font-black leading-5 text-[#294739]">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-9 flex justify-end"><button type="button" disabled={!contextComplete} onClick={() => goTo(1)} className="focus-ring rounded-full bg-[#153f2e] px-6 py-3.5 text-sm font-black text-white hover:bg-[#0d3223] disabled:cursor-not-allowed disabled:opacity-35">Comenzar evaluación →</button></div>
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
              <h3 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.045em] text-[#153f2e] sm:text-4xl">Sumá números para obtener una lectura más concreta.</h3>
              <p className="mt-4 max-w-2xl leading-7 text-[#60736a]">Si los completás, calculamos resultado, margen y punto de equilibrio. Podés saltear esta parte sin perder el diagnóstico estratégico.</p>

              <div className="mt-7 flex w-fit rounded-xl bg-[#eef5f0] p-1" role="group" aria-label="Moneda">
                {(["ARS", "USD"] as const).map((currency) => <button key={currency} type="button" onClick={() => setContext((current) => ({ ...current, currency }))} className={`rounded-lg px-4 py-2 text-xs font-black ${context.currency === currency ? "bg-white text-[#153f2e] shadow-sm" : "text-[#71837b]"}`}>{currency}</button>)}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { key: "revenue", label: "Ventas mensuales", helper: "Total facturado en un mes normal" },
                  { key: "fixedCosts", label: "Costos fijos", helper: "Alquiler, sueldos, servicios, sistemas" },
                  { key: "variableCosts", label: "Costos variables", helper: "Insumos, comisiones y costos por venta" },
                ].map((field) => (
                  <label key={field.key} className="rounded-2xl border border-[#dce8e0] bg-[#f9fbfa] p-4">
                    <span className="text-xs font-black text-[#294739]">{field.label}</span><span className="mt-1 block min-h-8 text-[10px] leading-4 text-[#7a8b83]">{field.helper}</span>
                    <span className="mt-4 flex items-center gap-2 rounded-xl border border-[#d3e1d8] bg-white px-3"><span className="text-xs font-black text-[#4a8067]">{context.currency === "ARS" ? "$" : "US$"}</span><input inputMode="decimal" value={context[field.key as keyof Pick<BusinessContext, "revenue" | "fixedCosts" | "variableCosts">]} onChange={(event) => setContext((current) => ({ ...current, [field.key]: event.target.value }))} placeholder="0" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-black text-[#153f2e] outline-none" /></span>
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
