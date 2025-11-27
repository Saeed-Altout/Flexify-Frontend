import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/seo";

/**
 * Generate dynamic sitemap for Next.js 16
 * Includes all locales and dynamic routes
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  // Static routes for each locale
  const staticRoutes = ["", "/projects", "/services", "/contact"];

  // Generate sitemap entries for static routes
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      const localePrefix = locale !== routing.defaultLocale ? `/${locale}` : "";
      const path = `${localePrefix}${route}`;

      staticEntries.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: routing.locales.reduce((acc, loc) => {
            const locPrefix = loc !== routing.defaultLocale ? `/${loc}` : "";
            acc[loc] = `${baseUrl}${locPrefix}${route}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    }
  }

  // Dynamic routes - Projects
  // Note: In production, you might want to fetch these from your API
  // For now, we'll include a placeholder that can be extended
  const dynamicEntries: MetadataRoute.Sitemap = [];

  // If you have an API endpoint to fetch all project slugs, uncomment and use:
  /*
  try {
    const projects = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects?limit=1000&status=published`)
      .then(res => res.json())
      .then(data => data.data?.items || []);

    for (const locale of routing.locales) {
      for (const project of projects) {
        const localePrefix = locale !== routing.defaultLocale ? `/${locale}` : "";
        const slug = project.slug || project.id;
        
        dynamicEntries.push({
          url: `${baseUrl}${localePrefix}/projects/${slug}`,
          lastModified: project.updated_at || project.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: routing.locales.reduce((acc, loc) => {
              const locPrefix = loc !== routing.defaultLocale ? `/${loc}` : "";
              acc[loc] = `${baseUrl}${locPrefix}/projects/${slug}`;
              return acc;
            }, {} as Record<string, string>),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }
  */

  // If you have an API endpoint to fetch all service slugs, uncomment and use:
  /*
  try {
    const services = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/services?limit=1000`)
      .then(res => res.json())
      .then(data => data.data?.items || []);

    for (const locale of routing.locales) {
      for (const service of services) {
        const localePrefix = locale !== routing.defaultLocale ? `/${locale}` : "";
        const slug = service.slug || service.id;
        
        dynamicEntries.push({
          url: `${baseUrl}${localePrefix}/services/${slug}`,
          lastModified: service.updated_at || service.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: routing.locales.reduce((acc, loc) => {
              const locPrefix = loc !== routing.defaultLocale ? `/${loc}` : "";
              acc[loc] = `${baseUrl}${locPrefix}/services/${slug}`;
              return acc;
            }, {} as Record<string, string>),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching services for sitemap:", error);
  }
  */

  return [...staticEntries, ...dynamicEntries];
}
