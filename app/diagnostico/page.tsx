import type { Metadata } from "next";

import { BusinessPulse } from "@/components/BusinessPulse";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Diagnóstico 360° de negocio",
  description: "Evaluá 15 indicadores, calculá la salud financiera de tu negocio y recibí un plan personalizado de 30 días.",
  alternates: { canonical: "/diagnostico" },
};

export default function DiagnosticPage() {
  return (
    <PageShell
      eyebrow="Diagnóstico estratégico y financiero"
      title="Entendé tu negocio antes de decidir qué hacer."
      description="Evaluá cinco dimensiones, agregá tus números si querés y obtené un mapa de madurez con un plan priorizado de 30 días."
    >
      <section className="bg-[linear-gradient(180deg,#f5faf7_0%,#ffffff_100%)] px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <BusinessPulse />
        </div>
      </section>
    </PageShell>
  );
}
