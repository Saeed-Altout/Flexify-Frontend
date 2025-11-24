"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useSiteSettingQuery } from "@/modules/site-settings/site-settings-hook";
import { getIconComponent } from "@/utils/dynamic-icon-loader";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  IHeroSettings,
  IHeroTranslation,
} from "@/modules/site-settings/site-settings-type";

export function HeroSection() {
  const locale = useLocale();
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("hero");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("hero", locale);

  const heroSettings = settingsData?.data?.data;
  const heroValue = heroSettings?.value as IHeroSettings | undefined;
  const heroTranslation = translationData?.data?.data?.translations?.[0]
    ?.value as IHeroTranslation | undefined;

  // Parse description with bold text support
  const parseDescription = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const techIcons = (heroValue?.techIcons || [])
    .map((iconName) => {
      const IconComponent = getIconComponent(iconName);
      return {
        icon: IconComponent,
        name: iconName,
      };
    })
    .filter((item) => item.icon !== null);

  if (settingsLoading || translationLoading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 text-center">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-16 w-full max-w-3xl mb-6" />
        <Skeleton className="h-8 w-full max-w-2xl mb-8" />
        <Skeleton className="h-12 w-48 mb-12" />
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </section>
    );
  }

  if (!heroTranslation) {
    return null;
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 text-center">
      {/* Badge */}
      {heroTranslation.badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-border bg-muted/50 text-muted-foreground">
            {heroTranslation.badge}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </span>
        </motion.div>
      )}

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
      >
        {heroTranslation.title}
      </motion.h1>

      {/* Description */}
      {heroTranslation.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed"
        >
          {parseDescription(heroTranslation.description)}
        </motion.p>
      )}

      {/* CTA Button */}
      {heroTranslation.cta && heroValue?.ctaLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <Button
            size="lg"
            asChild
            className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-8 py-6 text-base font-medium"
          >
            <Link href={heroValue.ctaLink}>
              {heroTranslation.cta}
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Tech Icons */}
      {techIcons.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {techIcons.map((tech, index) => {
            if (!tech.icon) return null;
            const IconComponent = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-center"
              >
                <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground hover:text-foreground transition-colors" />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
