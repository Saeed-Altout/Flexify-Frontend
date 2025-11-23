"use client";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { useTestimonialsQuery } from "@/modules/testimonials/testimonials-hook";
import { ITestimonial } from "@/modules/testimonials/testimonials-type";
import { SkeletonCard } from "@/components/ui/skeleton-card";

function TestimonialCard({
  testimonial,
  locale,
}: {
  testimonial: ITestimonial;
  locale: string;
}) {
  const translation = testimonial.translations?.find((t) => t.locale === locale);
  const fallbackTranslation = testimonial.translations?.[0];
  const authorName =
    translation?.authorName || fallbackTranslation?.authorName || "Anonymous";
  const authorPosition =
    translation?.authorPosition || fallbackTranslation?.authorPosition || "";
  const company = translation?.company || fallbackTranslation?.company || "";
  const content =
    translation?.content || fallbackTranslation?.content || "";

  return (
    <Card className="w-64">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={testimonial.avatarUrl || undefined} alt={authorName} />
            <AvatarFallback>
              {(() => {
                if (!authorName) return "??";
                const words = authorName.trim().split(/\s+/);
                if (words.length >= 2) {
                  return (words[0][0] + words[1][0]).toUpperCase();
                } else {
                  return authorName.slice(0, 2).toUpperCase();
                }
              })()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground">
              {authorName}
            </figcaption>
            {(authorPosition || company) && (
              <p className="text-xs font-medium text-muted-foreground">
                {authorPosition}
                {authorPosition && company ? " at " : ""}
                {company}
              </p>
            )}
          </div>
        </div>
        {testimonial.rating && (
          <div className="mt-2 flex items-center gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
        )}
        <blockquote className="mt-3 text-sm text-secondary-foreground line-clamp-3">
          {content}
        </blockquote>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection() {
  const t = useTranslations("portfolio.home.testimonials");
  const locale = useLocale();

  const { data, isLoading } = useTestimonialsQuery({
    isApproved: true,
    locale,
    limit: 20,
    sortBy: "order_index",
    sortOrder: "asc",
  });

  const testimonials = data?.data?.data || [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t("title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="testimonial" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Testimonials Marquee */}
        <div className="relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden">
          {/* Marquee moving left to right (default) */}
          <Marquee pauseOnHover repeat={3} className="[--duration:120s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                locale={locale}
              />
            ))}
          </Marquee>
          {/* Marquee moving right to left (reverse) */}
          <Marquee
            pauseOnHover
            reverse
            repeat={3}
            className="[--duration:120s]"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                locale={locale}
              />
            ))}
          </Marquee>
          {/* Stylish gradient overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background/95 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background/95 to-transparent"></div>
          <div className="pointer-events-none absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background/90 to-transparent"></div>
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/90 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

