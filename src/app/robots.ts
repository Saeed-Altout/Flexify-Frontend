import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

/**
 * Generate robots.txt for Next.js 16
 * Controls search engine crawling behavior
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/auth/",
          "/api/",
          "/_next/",
          "/onboarding/",
          "/*.json$",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/auth/",
          "/api/",
          "/_next/",
          "/onboarding/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/auth/",
          "/api/",
          "/_next/",
          "/onboarding/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ""),
  };
}

