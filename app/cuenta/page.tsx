import type { Metadata } from "next";
import { AccountCenter } from "@/components/AccountCenter";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = { title: "Mi cuenta", description: "Acceso central a tu cuenta y herramientas de Growtella." };

export default function AccountPage() {
  return (
    <PageShell eyebrow="Tu espacio personal" title="Una cuenta para todo Growtella." description="Tu plan, usos de IA, historial y aplicaciones conectados con la misma identidad.">
      <AccountCenter />
    </PageShell>
  );
}
