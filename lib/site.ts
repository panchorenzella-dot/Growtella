export const siteConfig = {
  name: "Growtella",
  description:
    "Herramientas simples e inteligentes para entender, organizar y hacer crecer tu negocio.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "calculadoraemprendedora@gmail.com",
  calculatorUrl:
    process.env.NEXT_PUBLIC_CALCULATOR_URL ||
    "https://www.calculadoraemprendedora.com",
};

export type Product = {
  name: string;
  description: string;
  eyebrow: string;
  href: string;
  status: "available" | "coming";
  accent: "emerald" | "lime" | "mint";
};

export const products: Product[] = [
  {
    name: "Calculadora Emprendedora",
    description:
      "Calculá precios, costos, márgenes, punto de equilibrio e inversiones con resultados claros.",
    eyebrow: "16 calculadoras",
    href: siteConfig.calculatorUrl,
    status: "available",
    accent: "emerald",
  },
  {
    name: "Presupuestos con IA",
    description:
      "Creá presupuestos profesionales, editables y listos para enviar a tus clientes.",
    eyebrow: "Próxima herramienta",
    href: "#proximamente",
    status: "coming",
    accent: "lime",
  },
];
