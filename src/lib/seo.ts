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
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Flexify",
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "Flexify",
      "theme-color": "#000000",
    },
  };

  return metadata;
}

/**
 * Generate structured data for Person/Portfolio
 * Used internally by generateComprehensivePortfolioStructuredData
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

/**
 * Generate structured data for Organization
 */
export function generateOrganizationStructuredData({
  name,
  url,
  logo,
  description,
  contactPoint,
  sameAs,
  address,
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
    areaServed?: string;
  };
  sameAs?: string[];
  address?: {
    addressCountry: string;
    addressLocality: string;
    addressRegion?: string;
    streetAddress?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...contactPoint,
      },
    }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address,
      },
    }),
  };
}

/**
 * Generate structured data for WebSite
 */
export function generateWebSiteStructuredData({
  name,
  url,
  description,
  potentialAction,
  publisher,
}: {
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
    ...(potentialAction && { potentialAction }),
    ...(publisher && { publisher }),
  };
}

/**
 * Generate structured data for ProfessionalService
 */
export function generateProfessionalServiceStructuredData({
  name,
  description,
  url,
  provider,
  areaServed,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  url: string;
  provider?: {
    name: string;
    url: string;
    jobTitle?: string;
  };
  areaServed?: string | string[];
  serviceType?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
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
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers,
      },
    }),
  };
}

/**
 * Generate structured data for ItemList (for projects/services lists)
 */
export function generateItemListStructuredData({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: Array<{
    name: string;
    description?: string;
    url: string;
    image?: string;
    position?: number;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description && { description }),
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        ...(item.description && { description: item.description }),
        url: item.url,
        ...(item.image && { image: item.image }),
      },
    })),
  };
}

/**
 * Generate comprehensive structured data for Portfolio
 */
export function generateComprehensivePortfolioStructuredData({
  person,
  organization,
  website,
  projects,
  services,
}: {
  person: {
    name: string;
    jobTitle: string;
    description: string;
    url: string;
    image?: string;
    email?: string;
    telephone?: string;
    address?: {
      addressCountry: string;
      addressLocality: string;
      addressRegion?: string;
    };
    sameAs?: string[];
  };
  organization?: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
  };
  website?: {
    name: string;
    url: string;
    description?: string;
  };
  projects?: Array<{
    name: string;
    description: string;
    url: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
  }>;
  services?: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}) {
  const structuredData: Array<Record<string, unknown>> = [
    generatePersonStructuredData({
      name: person.name,
      jobTitle: person.jobTitle,
      description: person.description,
      url: person.url,
      image: person.image,
      sameAs: person.sameAs,
    }),
  ];

  if (organization) {
    structuredData.push(
      generateOrganizationStructuredData({
        name: organization.name,
        url: organization.url,
        logo: organization.logo,
        description: organization.description,
        contactPoint: person.email
          ? {
              email: person.email,
              contactType: "Customer Service",
              areaServed: person.address?.addressCountry,
            }
          : undefined,
        sameAs: person.sameAs,
        address: person.address
          ? {
              addressCountry: person.address.addressCountry,
              addressLocality: person.address.addressLocality,
              addressRegion: person.address.addressRegion,
            }
          : undefined,
      })
    );
  }

  if (website) {
    structuredData.push(
      generateWebSiteStructuredData({
        name: website.name,
        url: website.url,
        description: website.description,
        publisher: organization
          ? {
              "@type": "Organization",
              name: organization.name,
              logo: organization.logo,
            }
          : undefined,
      })
    );
  }

  if (projects && projects.length > 0) {
    structuredData.push(
      generateItemListStructuredData({
        name: "Portfolio Projects",
        description: "A collection of web development projects",
        url: `${person.url}/projects`,
        items: projects.map((project, index) => ({
          name: project.name,
          description: project.description,
          url: project.url,
          image: project.image,
          position: index + 1,
        })),
      })
    );
  }

  if (services && services.length > 0) {
    structuredData.push(
      generateItemListStructuredData({
        name: "Services",
        description: "Professional web development services",
        url: `${person.url}/services`,
        items: services.map((service, index) => ({
          name: service.name,
          description: service.description,
          url: service.url,
          position: index + 1,
        })),
      })
    );
  }

  return structuredData;
}
