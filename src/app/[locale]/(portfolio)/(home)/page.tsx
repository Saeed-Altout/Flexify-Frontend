import { HeroSection } from "./_components/hero-section";
import { StatisticsSection } from "./_components/statistics-section";
import { AboutSection } from "./_components/about-section";
import { ServicesSection } from "./_components/services-section";
import { TestimonialsSection } from "./_components/testimonials-section";

export default function HomePage() {
  return (
    <main className="container">
      <HeroSection />
      <StatisticsSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
    </main>
  );
}
