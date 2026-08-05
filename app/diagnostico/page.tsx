import type { Metadata } from "next";

import { BusinessPulse } from "@/components/BusinessPulse";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Diagnóstico 360° de negocio",
  description: "Recibí preguntas adaptadas a tu tipo de negocio, calculá tu salud financiera y obtené un plan personalizado de 30 días.",
  alternates: { canonical: "/diagnostico" },
};

export default function DiagnosticPage() {
  return (
    <PageShell
      eyebrow="Diagnóstico adaptativo y financiero"
      title="Primero entendemos tu negocio. Después lo evaluamos."
      description="Contanos qué vendés y cómo funciona. Growtella adapta las preguntas, analiza cinco dimensiones y crea un plan de 30 días para tu realidad."
    >
      <section className="bg-[linear-gradient(180deg,#f5faf7_0%,#ffffff_100%)] px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <BusinessPulse />
        </div>
      </section>
    </PageShell>
  );
}
