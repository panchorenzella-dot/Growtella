export const siteConfig = {
  name: "Growtella",
  description:
    "Herramientas simples e inteligentes para entender, organizar y hacer crecer tu negocio.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "contacto@growtella.com",
  calculatorUrl:
    process.env.NEXT_PUBLIC_CALCULATOR_URL ||
    "https://www.calculadoraemprendedora.com",
};

type ProductBase = {
  name: string;
  description: string;
  eyebrow: string;
  accent: "emerald" | "lime" | "mint";
  features: string[];
};

export type Product = ProductBase & (
  | { status: "available"; href: string; price: string; priceDetail: string; external?: boolean }
  | { status: "coming"; href?: never; price?: never; priceDetail?: never; external?: never }
);

export const products: Product[] = [
  {
    name: "Calculadora Emprendedora",
    description:
      "Calculá precios, costos, márgenes, punto de equilibrio e inversiones con resultados claros.",
    eyebrow: "16 calculadoras",
    href: siteConfig.calculatorUrl,
    status: "available",
    accent: "emerald",
    price: "Gratis",
    priceDetail: "funciones esenciales",
    features: ["16 calculadoras", "Costos y márgenes", "Punto de equilibrio"],
    external: true,
  },
  {
    name: "Diagnóstico 360°",
    description:
      "Recibí preguntas según tu tipo de negocio, sumá tus números y obtené un plan de 30 días.",
    eyebrow: "Nuevo · Informe completo",
    href: "/diagnostico",
    status: "available",
    accent: "mint",
    price: "Gratis",
    priceDetail: "sin registro",
    features: ["Preguntas adaptadas a tu negocio", "Margen y punto de equilibrio", "Plan personalizado de 30 días"],
  },
  {
    name: "Presupuestos Inteligentes",
    description:
      "Creá presupuestos profesionales, editables y listos para enviar a tus clientes.",
    eyebrow: "Próximamente",
    status: "coming",
    accent: "lime",
    features: ["Edición asistida", "Diseños profesionales", "Exportación lista para enviar"],
  },
];
