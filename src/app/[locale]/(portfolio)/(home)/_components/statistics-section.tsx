"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useSiteSettingQuery } from "@/modules/site-settings/site-settings-hook";
import { getIconComponent } from "@/utils/dynamic-icon-loader";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  IStatisticsSettings,
  IStatisticsTranslation,
} from "@/modules/site-settings/site-settings-type";

export function StatisticsSection() {
  const locale = useLocale();
  const t = useTranslations("portfolio.home.statistics");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("statistics");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("statistics", locale);

  const statisticsSettings = settingsData?.data?.data;
  const statisticsValue = statisticsSettings?.value as
    | IStatisticsSettings
    | undefined;
  const statisticsTranslation = translationData?.data?.data?.translations?.[0]
    ?.value as IStatisticsTranslation | undefined;
  
  // Use API translation if available, otherwise use frontend translation keys as fallback
  const sectionTitle = statisticsTranslation?.title || t("title");
  const sectionDescription = statisticsTranslation?.description || t("description");

  if (settingsLoading || translationLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show section if statistics data exists, even without translations
  if (!statisticsValue) {
    return null;
  }

  const items = (statisticsValue.items || []).sort(
    (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
  );

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
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Statistics Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              // Use API translation label if available, otherwise use frontend translation or fallback to stat.id
              const label =
                statisticsTranslation?.items?.[stat.id]?.label ||
                t(`items.${stat.id}.label`) ||
                stat.id;

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
                      {label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
