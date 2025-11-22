"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  IconCode,
  IconRocket,
  IconHeart,
  IconTarget,
} from "@tabler/icons-react";

const highlights = [
  {
    id: "code",
    icon: IconCode,
  },
  {
    id: "rocket",
    icon: IconRocket,
  },
  {
    id: "heart",
    icon: IconHeart,
  },
  {
    id: "target",
    icon: IconTarget,
  },
];

export function AboutSection() {
  const t = useTranslations("portfolio.home.about");

  // Parse description with bold text support
  const parseText = (text: string) => {
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

  const getHighlightTitle = (id: string): string => {
    const key = `highlights.${id}.title` as
      | "highlights.code.title"
      | "highlights.rocket.title"
      | "highlights.heart.title"
      | "highlights.target.title";
    return t(key);
  };

  const getHighlightDescription = (id: string): string => {
    const key = `highlights.${id}.description` as
      | "highlights.code.description"
      | "highlights.rocket.description"
      | "highlights.heart.description"
      | "highlights.target.description";
    return t(key);
  };

  return (
    <section className="py-16 px-4">
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
              {t("title")}
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>{parseText(t("description1"))}</p>
              <p>{parseText(t("description2"))}</p>
            </div>
            <div className="mt-8">
              <Button size="lg" variant="outline" className="rounded-lg">
                {t("cta")}
              </Button>
            </div>
          </motion.div>

          {/* Right Side - Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((highlight, index) => {
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
                    {getHighlightTitle(highlight.id)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getHighlightDescription(highlight.id)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
