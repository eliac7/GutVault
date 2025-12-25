import { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Public marketing routes
  const routes = [
    "",
    "/privacy",
  ];

  // Generate sitemap entries for all locales
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const url = locale === defaultLocale 
        ? `${baseUrl}${route}` 
        : `${baseUrl}/${locale}${route}`;
      
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}

