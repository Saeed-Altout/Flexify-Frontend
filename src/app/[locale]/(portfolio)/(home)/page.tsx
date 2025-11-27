import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "./_components/hero-section";
import { StatisticsSection } from "./_components/statistics-section";
import { AboutSection } from "./_components/about-section";
import { ServicesSection } from "./_components/services-section";
import { FeaturedProjectsSection } from "./_components/featured-projects-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import { generateSeoMetadata, generatePersonStructuredData, generatePortfolioStructuredData } from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { getBaseUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.home.hero");

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    keywords: [
      "Full Stack Developer",
      "Next.js Developer",
      "NestJS Developer",
      "TypeScript",
      "React",
      "Web Development",
      "Portfolio",
      "Software Engineer",
    ],
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

  // Generate structured data for Person/Portfolio
  const personStructuredData = generatePersonStructuredData({
    name: "Flexify",
    jobTitle: "Full Stack Developer",
    description: t("description"),
    url: baseUrl,
    image: `${baseUrl}/og.jpeg`,
    sameAs: [
      "https://github.com/Saeed-Altout",
      // Add more social media links if available
    ],
  });

  const portfolioStructuredData = generatePortfolioStructuredData({
    name: "Flexify Portfolio",
    description: t("description"),
    url: baseUrl,
  });

  return (
    <>
      <StructuredData data={[personStructuredData, portfolioStructuredData]} />
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
