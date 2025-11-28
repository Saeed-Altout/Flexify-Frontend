import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "./_components/hero-section";
import { StatisticsSection } from "./_components/statistics-section";
import { AboutSection } from "./_components/about-section";
import { ServicesSection } from "./_components/services-section";
import { FeaturedProjectsSection } from "./_components/featured-projects-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import {
  generateSeoMetadata,
  generateComprehensivePortfolioStructuredData,
  generateWebSiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { getBaseUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.home.hero");

  const seoT = await getTranslations("portfolio.seo.default");

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    keywords: seoT.raw("keywords") as string[],
    path: "/",
    locale,
    type: "website",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  const t = await getTranslations("portfolio.home.hero");

  const seoT = await getTranslations("portfolio.seo.default");
  const siteName = seoT("siteName");

  // Generate comprehensive structured data
  const comprehensiveStructuredData =
    generateComprehensivePortfolioStructuredData({
      person: {
        name: "Saeed Altout",
        jobTitle: t("badge") || "Frontend Developer",
        description: t("description"),
        url: baseUrl,
        image: `${baseUrl}/og.jpeg`,
        email: "saeedaltout25@gmail.com",
        telephone: "+963940043810",
        address: {
          addressCountry: "SY",
          addressLocality: "Damascus",
          addressRegion: "Damascus",
        },
        sameAs: [
          "https://github.com/Saeed-Altout",
          "https://t.me/saeedaltoutdev",
          `https://wa.me/963940043810`,
        ],
      },
      organization: {
        name: "Flexify",
        url: baseUrl,
        logo: `${baseUrl}/logo-light.svg`,
        description: t("description"),
      },
      website: {
        name: siteName,
        url: baseUrl,
        description: t("description"),
      },
    });

  // Generate WebSite structured data with search action
  const websiteStructuredData = generateWebSiteStructuredData({
    name: siteName,
    url: baseUrl,
    description: t("description"),
    publisher: {
      "@type": "Organization",
      name: "Flexify",
      logo: `${baseUrl}/logo-light.svg`,
    },
  });

  // Generate Organization structured data
  const organizationStructuredData = generateOrganizationStructuredData({
    name: "Flexify",
    url: baseUrl,
    logo: `${baseUrl}/logo-light.svg`,
    description: t("description"),
    contactPoint: {
      email: "saeedaltout25@gmail.com",
      telephone: "+963940043810",
      contactType: "Customer Service",
      areaServed: "SY",
    },
    sameAs: [
      "https://github.com/Saeed-Altout",
      "https://t.me/saeedaltoutdev",
    ],
    address: {
      addressCountry: "SY",
      addressLocality: "Damascus",
      addressRegion: "Damascus",
    },
  });

  return (
    <>
      <StructuredData
        data={[
          ...comprehensiveStructuredData,
          websiteStructuredData,
          organizationStructuredData,
        ]}
      />
      <main id="main-content">
        {/* Section 1: Hero */}
        <HeroSection />
        
        {/* Section 2: Statistics */}
        <StatisticsSection />
        
        {/* Section 3: About */}
        <AboutSection />
        <ServicesSection />
        <FeaturedProjectsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
}
