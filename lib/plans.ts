export const PLAN_LIMITS = {
  free: {
    analysis: 1,
    analysisPeriod: "semana",
    chat: 5,
    chatPeriod: "día",
    scenarios: 3,
    scenariosPeriod: "día",
  },
  pro: {
    analysis: 30,
    analysisPeriod: "mes",
    chat: 300,
    chatPeriod: "mes",
    scenarios: null,
    scenariosPeriod: "sin límite",
  },
} as const;

export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Básico",
    tagline: "Para ordenar tus primeros números",
    priceUsd: 7.99,
    description: "Las herramientas esenciales y una ayuda puntual de IA para empezar con claridad.",
    features: [
      "Calculadoras de precio, margen y punto de equilibrio",
      "Hasta 2 escenarios guardados",
      "5 análisis con IA por mes",
      "Soporte por email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "El punto justo para decidir mejor",
    priceUsd: 19.99,
    recommended: true,
    description: "Todas las calculadoras, comparación y capacidad suficiente para trabajar cada mes.",
    features: [
      "Todas las calculadoras, incluidas las de rubro",
      "Escenarios guardados ilimitados",
      "Comparación de hasta 3 escenarios lado a lado",
      "50 análisis con IA por mes",
      "Soporte prioritario",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Para uso intensivo y acompañamiento",
    priceUsd: 39.99,
    description: "Máxima capacidad, acceso anticipado y una instancia mensual de consulta personalizada.",
    features: [
      "Todo lo incluido en Pro",
      "Acceso anticipado a nuevas calculadoras",
      "Comparaciones simultáneas sin límite",
      "Análisis con IA ilimitados",
      "Soporte prioritario + consulta 1 a 1 mensual",
    ],
  },
] as const;

export type PricingPlanId = (typeof PRICING_PLANS)[number]["id"];

// Se conserva para sincronizar suscripciones anteriores creadas desde Growtella.
export const BILLING_OPTIONS = [
  { id: "monthly", label: "Mensual", months: 1, totalUsd: 19.99, monthlyUsd: 19.99, discount: 0 },
  { id: "quarterly", label: "Trimestral", months: 3, totalUsd: 53.99, monthlyUsd: 18, discount: 10 },
  { id: "annual", label: "Anual", months: 12, totalUsd: 191.99, monthlyUsd: 16, discount: 20 },
] as const;

export type BillingInterval = (typeof BILLING_OPTIONS)[number]["id"];

export const PLAN_GRACE_DAYS = 2;
