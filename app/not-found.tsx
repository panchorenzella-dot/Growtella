import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-5 py-20 text-center">
      <div><p className="eyebrow">Error 404</p><h1 className="mt-4 text-5xl font-black tracking-[-.05em] text-[#153f2e]">Esta página todavía no creció.</h1><p className="mx-auto mt-5 max-w-lg text-lg text-[#5b6f66]">El enlace puede haber cambiado o la herramienta aún no está disponible.</p><Link href="/" className="mt-8 inline-flex rounded-full bg-[#153f2e] px-6 py-3 text-sm font-black text-white">Volver al inicio</Link></div>
    </main>
  );
}
