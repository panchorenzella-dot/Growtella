import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dfe9e2] bg-[#f7faf8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_.8fr_.8fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#5b6f66]">{siteConfig.description}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-[#789087]">Creado para emprendedores</p>
        </div>
        <div>
          <p className="text-sm font-extrabold text-[#153f2e]">Plataforma</p>
          <div className="mt-4 grid gap-3 text-sm text-[#5b6f66]">
            <Link href="/herramientas" className="hover:text-[#153f2e]">Herramientas</Link>
            <Link href="/diagnostico" className="hover:text-[#153f2e]">Diagnóstico 360°</Link>
            <Link href="/pro" className="hover:text-[#153f2e]">Growtella Pro</Link>
            <Link href="/cuenta" className="hover:text-[#153f2e]">Mi cuenta</Link>
            <Link href="/contacto" className="hover:text-[#153f2e]">Contacto</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-extrabold text-[#153f2e]">Información</p>
          <div className="mt-4 grid gap-3 text-sm text-[#5b6f66]">
            <Link href="/privacidad" className="hover:text-[#153f2e]">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#153f2e]">Términos</Link>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-[#153f2e]">Soporte</a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e4ece7] px-5 py-5 text-center text-xs text-[#71857c]">
        © {new Date().getFullYear()} Growtella. Hecho para tomar mejores decisiones.
      </div>
    </footer>
  );
}
