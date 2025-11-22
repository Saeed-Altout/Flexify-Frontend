"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  IconBrandNextjs,
  IconBrandTypescript,
  IconBrandMysql,
  IconBrandSupabase,
  IconServer,
  IconDatabase,
} from "@tabler/icons-react";

export function HeroSection() {
  const t = useTranslations("portfolio.home.hero");

  // Parse description with bold text support
  const parseDescription = (text: string) => {
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

  const techIcons = [
    { icon: IconBrandNextjs, name: "Next.js" },
    { icon: IconServer, name: "NestJS" },
    { icon: IconBrandTypescript, name: "TypeScript" },
    { icon: IconDatabase, name: "Prisma" },
    { icon: IconBrandMysql, name: "MySQL" },
    { icon: IconBrandSupabase, name: "Supabase" },
  ];

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4 text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-border bg-muted/50 text-muted-foreground">
          {t("badge")}
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

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
      >
        {t("title")}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed"
      >
        {parseDescription(t("description"))}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <Button
          size="lg"
          className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-8 py-6 text-base font-medium"
        >
          {t("cta")}
        </Button>
      </motion.div>

      {/* Tech Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
      >
        {techIcons.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-center"
          >
            <tech.icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground hover:text-foreground transition-colors" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
