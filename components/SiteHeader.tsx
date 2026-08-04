import Link from "next/link";
import { BrandMark } from "./BrandMark";

const links = [
  { href: "/herramientas", label: "Herramientas" },
  { href: "/pro", label: "Growtella Pro" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce7df]/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="rounded-xl focus-ring" aria-label="Inicio de Growtella">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#496057] md:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#153f2e] focus-ring">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/cuenta" className="rounded-full px-4 py-2.5 text-sm font-bold text-[#153f2e] transition hover:bg-[#eff6f1] focus-ring">
            Ingresar
          </Link>
          <Link href="/herramientas" className="rounded-full bg-[#153f2e] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d3223] focus-ring">
            Empezar gratis
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-[#d7e5dc] text-[#153f2e] focus-ring">
            <span className="sr-only">Abrir menú</span>
            <span className="text-xl leading-none">☰</span>
          </summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-[#dbe7df] bg-white p-3 shadow-2xl shadow-[#153f2e]/10">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#334b41] hover:bg-[#f1f7f3]">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-[#e5ede8] pt-3">
              <Link href="/cuenta" className="rounded-xl px-4 py-3 text-center text-sm font-bold text-[#153f2e]">Ingresar</Link>
              <Link href="/herramientas" className="rounded-xl bg-[#153f2e] px-4 py-3 text-center text-sm font-bold text-white">Empezar gratis</Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
