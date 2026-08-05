import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Growtella | Herramientas para hacer crecer tu negocio", template: "%s | Growtella" },
  description: siteConfig.description,
  applicationName: "Growtella",
  keywords: ["herramientas para emprendedores", "calculadora de negocios", "inteligencia artificial", "presupuestos", "Growtella"],
  openGraph: {
    title: "Growtella | Herramientas para hacer crecer tu negocio",
    description: siteConfig.description,
    type: "website",
    locale: "es_AR",
    siteName: "Growtella",
    images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: "Growtella — Diagnóstico 360° para tu negocio" }],
  },
  twitter: { card: "summary_large_image", title: "Growtella", description: siteConfig.description, images: ["/og-v2.png"] },
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Growtella",
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
  };

  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}>
      <body className="flex min-h-screen flex-col bg-white text-[#10291f]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
