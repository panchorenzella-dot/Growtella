import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Información legal" title="Política de privacidad" description="Cómo Growtella protege y utiliza la información necesaria para ofrecer sus herramientas.">
      <article className="prose mx-auto max-w-3xl px-5 py-16 text-[#4f655b] sm:px-8 sm:py-20">
        <p className="text-sm font-bold text-[#72847c]">Última actualización: agosto de 2026</p>
        <h2>Responsable y contacto</h2><p>Growtella es una plataforma digital de herramientas para emprendedores. Para consultas relacionadas con privacidad podés escribir a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
        <h2>Información que utilizamos</h2><p>Podemos tratar datos de registro, preferencias, información que ingreses voluntariamente en las herramientas, historial de uso, estado de la suscripción y datos técnicos básicos necesarios para seguridad y funcionamiento.</p>
        <h2>Para qué se utiliza</h2><p>La información se utiliza para autenticar usuarios, guardar resultados, administrar beneficios y créditos, mejorar las herramientas, prevenir abusos y responder solicitudes de soporte.</p>
        <h2>Servicios externos</h2><p>Growtella utiliza Vercel para alojamiento, Supabase para cuentas y datos, Google Analytics para medición agregada, PayPal para pagos y OpenAI para funciones de inteligencia artificial. Solo se comparte la información necesaria para prestar cada servicio y se aplican las condiciones propias de esos proveedores.</p>
        <h2>Analítica y cookies</h2><p>Google Analytics nos ayuda a entender qué páginas se visitan, desde qué tipo de dispositivo y cómo se utiliza el sitio. Esta medición no se utiliza para vender información personal. Podés limitar estas tecnologías desde la configuración de tu navegador.</p>
        <h2>Pagos</h2><p>Los pagos se procesan de forma segura en PayPal. Growtella no recibe ni almacena los datos completos de tu tarjeta. Conservamos únicamente el identificador, estado y período de la suscripción necesarios para habilitar los beneficios Pro.</p>
        <h2>Inteligencia artificial</h2><p>Los datos enviados a funciones de IA se utilizan para generar la respuesta solicitada. Evitá ingresar información confidencial, datos bancarios completos o datos personales sensibles de terceros.</p>
        <h2>Conservación y derechos</h2><p>Conservamos la información mientras la cuenta esté activa o resulte necesaria para cumplir obligaciones. Podés solicitar acceso, corrección o eliminación escribiendo al correo de contacto.</p>
        <h2>Actualizaciones</h2><p>Esta política puede actualizarse cuando se incorporen herramientas o proveedores. La fecha de la versión vigente se mantendrá visible en esta página.</p>
      </article>
    </PageShell>
  );
}
