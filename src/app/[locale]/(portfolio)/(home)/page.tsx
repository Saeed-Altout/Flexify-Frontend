import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "./_components/hero-section";
import { StatisticsSection } from "./_components/statistics-section";
import { AboutSection } from "./_components/about-section";
import { ServicesSection } from "./_components/services-section";
import { FeaturedProjectsSection } from "./_components/featured-projects-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.home.hero");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function HomePage() {
  return (
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
  );
}
