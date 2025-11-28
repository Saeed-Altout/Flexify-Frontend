import { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string, locale?: string): string {
  const baseUrl = getBaseUrl();
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${localePrefix}${cleanPath}`;
}

/**
 * Generate alternate language URLs
 */
export function getAlternateUrls(path: string): Record<string, string> {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return routing.locales.reduce((acc, locale) => {
    const localePrefix = locale !== routing.defaultLocale ? `/${locale}` : "";
    acc[locale] = `${baseUrl}${localePrefix}${cleanPath}`;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get OpenGraph image URL
 */
export function getOgImageUrl(imagePath?: string): string {
  const baseUrl = getBaseUrl();
  if (imagePath) {
    return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`;
  }
  return `${baseUrl}/og.jpeg`;
}

/**
 * Generate SEO metadata with best practices
 */
export function generateSeoMetadata({
  title,
  description,
  keywords,
  path = "/",
  locale = "en",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  locale?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl(path, locale);
  const alternateUrls = getAlternateUrls(path);
  const ogImage = getOgImageUrl(image);
  const siteName = "Flexify Portfolio";

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: keywords || [],
    authors: authors?.map((name) => ({ name })) || [{ name: "Flexify" }],
    creator: "Flexify",
    publisher: "Flexify",
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      type,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      url: canonicalUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@flexify",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  };

  return metadata;
}

/**
 * Generate structured data for Person/Portfolio
 */
export function generatePersonStructuredData({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs,
}: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    url,
    ...(image && { image }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Generate structured data for Portfolio/Collection
 */
export function generatePortfolioStructuredData({
  name,
  description,
  url,
  projects,
}: {
  name: string;
  description: string;
  url: string;
  projects?: Array<{
    name: string;
    description: string;
    url: string;
    image?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    ...(projects &&
      projects.length > 0 && {
        mainEntity: {
          "@type": "ItemList",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              name: project.name,
              description: project.description,
              url: project.url,
              ...(project.image && { image: project.image }),
            },
          })),
        },
      }),
  };
}

/**
 * Generate structured data for Project/SoftwareApplication
 */
export function generateProjectStructuredData({
  name,
  description,
  url,
  image,
  applicationCategory,
  operatingSystem,
  offers,
  aggregateRating,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    ...(image && { image }),
    ...(applicationCategory && { applicationCategory }),
    ...(operatingSystem && { operatingSystem }),
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers,
      },
    }),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ...aggregateRating,
      },
    }),
  };
}

/**
 * Generate structured data for Service
 */
export function generateServiceStructuredData({
  name,
  description,
  url,
  provider,
  areaServed,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  provider?: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    ...(provider && {
      provider: {
        "@type": "Person",
        ...provider,
      },
    }),
    ...(areaServed && { areaServed }),
    ...(serviceType && { serviceType }),
  };
}

/**
 * Generate structured data for BreadcrumbList
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
