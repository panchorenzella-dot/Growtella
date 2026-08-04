import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/herramientas", "/pro", "/contacto", "/privacidad", "/terminos"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/herramientas" ? 0.9 : path === "/pro" ? 0.8 : 0.6,
  }));
}
