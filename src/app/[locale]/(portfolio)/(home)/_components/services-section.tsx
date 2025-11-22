"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  IconCode,
  IconDeviceDesktop,
  IconDatabase,
  IconCloud,
  IconDeviceMobile,
  IconSettings,
} from "@tabler/icons-react";

const services = [
  {
    id: "web",
    icon: IconCode,
  },
  {
    id: "frontend",
    icon: IconDeviceDesktop,
  },
  {
    id: "backend",
    icon: IconDatabase,
  },
  {
    id: "cloud",
    icon: IconCloud,
  },
  {
    id: "mobile",
    icon: IconDeviceMobile,
  },
  {
    id: "devops",
    icon: IconSettings,
  },
];

export function ServicesSection() {
  const t = useTranslations("portfolio.home.services");

  const getServiceTitle = (id: string): string => {
    const key = `items.${id}.title` as
      | "items.web.title"
      | "items.frontend.title"
      | "items.backend.title"
      | "items.cloud.title"
      | "items.mobile.title"
      | "items.devops.title";
    return t(key);
  };

  const getServiceDescription = (id: string): string => {
    const key = `items.${id}.description` as
      | "items.web.description"
      | "items.frontend.description"
      | "items.backend.description"
      | "items.cloud.description"
      | "items.mobile.description"
      | "items.devops.description";
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

        {/* Services Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isLast = index === services.length - 1;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {isLast ? (
                  <div className="bg-card border border-dashed rounded-lg p-6 hover:shadow-lg transition-shadow h-full">
                    <p className="text-sm text-muted-foreground">
                      {t("items.devops.moreContent")}
                    </p>
                    <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-muted-foreground">
                      <li>{t("items.devops.features.0")}</li>
                      <li>{t("items.devops.features.1")}</li>
                      <li>{t("items.devops.features.2")}</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow h-full">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {getServiceTitle(service.id)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getServiceDescription(service.id)}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
