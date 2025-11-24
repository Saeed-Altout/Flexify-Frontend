"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useSiteSettingQuery } from "@/modules/site-settings/site-settings-hook";
import { getIconComponent } from "@/utils/dynamic-icon-loader";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  IAboutSettings,
  IAboutTranslation,
} from "@/modules/site-settings/site-settings-type";

export function AboutSection() {
  const locale = useLocale();
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("about");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("about", locale);

  const aboutSettings = settingsData?.data?.data;
  const aboutValue = aboutSettings?.value as IAboutSettings | undefined;
  const aboutTranslation = translationData?.data?.data?.translations?.[0]
    ?.value as IAboutTranslation | undefined;

  // Parse description with bold text support
  const parseText = (text: string) => {
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

  if (settingsLoading || translationLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutTranslation || !aboutValue) {
    return null;
  }

  const highlights = (aboutValue.highlights || []).map((highlight) => {
    const IconComponent = getIconComponent(highlight.icon);
    const translation = aboutTranslation.highlights?.[highlight.id];
    return {
      ...highlight,
      icon: IconComponent,
      title: translation?.title || highlight.id,
      description: translation?.description || "",
    };
  });

  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {aboutTranslation.title}
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {aboutTranslation.description1 && (
                <p>{parseText(aboutTranslation.description1)}</p>
              )}
              {aboutTranslation.description2 && (
                <p>{parseText(aboutTranslation.description2)}</p>
              )}
            </div>
            {aboutTranslation.cta && aboutValue?.ctaLink && (
              <div className="mt-8">
                <Button size="lg" variant="outline" className="rounded-lg" asChild>
                  <Link href={aboutValue.ctaLink}>
                    {aboutTranslation.cta}
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Right Side - Highlights Grid */}
          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {highlights.map((highlight, index) => {
                if (!highlight.icon) return null;
                const IconComponent = highlight.icon;
                return (
                  <motion.div
                    key={highlight.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {highlight.title}
                    </h3>
                    {highlight.description && (
                      <p className="text-sm text-muted-foreground">
                        {highlight.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
