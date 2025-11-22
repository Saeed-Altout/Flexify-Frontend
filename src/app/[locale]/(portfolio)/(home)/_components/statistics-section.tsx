"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { STATISTICS } from "@/constants/site.constants";
import {
  IconBriefcase,
  IconFolder,
  IconCode,
  IconUsers,
} from "@tabler/icons-react";

const iconMap = {
  briefcase: IconBriefcase,
  folder: IconFolder,
  code: IconCode,
  users: IconUsers,
};

export function StatisticsSection() {
  const t = useTranslations("portfolio.home.statistics");

  const getStatLabel = (id: string): string => {
    const key = `items.${id}.label` as
      | "items.years.label"
      | "items.projects.label"
      | "items.technologies.label"
      | "items.clients.label";
    return t(key);
  };

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

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATISTICS.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-4">
                    {IconComponent && (
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-3xl md:text-4xl font-bold text-foreground ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {getStatLabel(stat.id)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
