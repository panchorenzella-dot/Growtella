import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function TermsPage() {
  return (
    <PageShell eyebrow="Información legal" title="Términos y condiciones" description="Reglas claras para utilizar Growtella y sus aplicaciones.">
      <article className="prose mx-auto max-w-3xl px-5 py-16 text-[#4f655b] sm:px-8 sm:py-20">
        <p className="text-sm font-bold text-[#72847c]">Última actualización: agosto de 2026</p>
        <h2>Alcance del servicio</h2><p>Growtella ofrece herramientas digitales de cálculo, organización y asistencia mediante inteligencia artificial. Algunas funciones pueden operar desde dominios propios, pero formar parte del mismo ecosistema.</p>
        <h2>Uso responsable</h2><p>Los resultados son orientativos y dependen de la información ingresada. El usuario debe verificarlos antes de tomar decisiones comerciales, financieras, impositivas o legales.</p>
        <h2>Cuenta</h2><p>El usuario es responsable de mantener segura su cuenta y de informar accesos no autorizados. No se permite utilizar el servicio para actividades ilícitas, abusivas o que afecten a otros usuarios.</p>
        <h2>Planes y créditos</h2><p>Las funciones gratuitas, los créditos de IA y los beneficios Pro pueden variar según la herramienta. Antes de contratar se informarán precio, período, renovación y beneficios aplicables.</p>
        <h2>Disponibilidad</h2><p>Trabajamos para mantener las aplicaciones disponibles, pero pueden existir interrupciones por mantenimiento o servicios de terceros. Growtella puede corregir, reemplazar o retirar funciones cuando sea necesario.</p>
        <h2>Propiedad intelectual</h2><p>El diseño, marca, textos y software de Growtella están protegidos. Los usuarios conservan la titularidad de la información propia que ingresen y de los documentos que generen cuando corresponda.</p>
        <h2>Contacto</h2><p>Para consultas sobre estos términos escribí a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      </article>
    </PageShell>
  );
}
