"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useServicesQuery } from "@/modules/services/services-hook";
import { IService } from "@/modules/services/services-type";
import { IconCode } from "@tabler/icons-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export function ServicesSection() {
  const t = useTranslations("portfolio.home.services");
  const locale = useLocale();

  const { data, isLoading } = useServicesQuery({
    isActive: true,
    isFeatured: true,
    locale,
    limit: 6,
    sortBy: "order_index",
    sortOrder: "asc",
  });

  const services = data?.data?.data || [];

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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="service" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service: IService, index: number) => {
              const translation = service.translations?.find(
                (t) => t.locale === locale
              );
              const fallbackTranslation = service.translations?.[0];
              const name =
                translation?.name || fallbackTranslation?.name || service.slug;
              const description =
                translation?.shortDescription ||
                translation?.description ||
                fallbackTranslation?.shortDescription ||
                fallbackTranslation?.description ||
                "";

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow h-full cursor-pointer">
                      {service.imageUrl ? (
                        <div className="mb-4 relative h-32 w-full rounded-lg overflow-hidden">
                          <Image
                            src={service.imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : service.icon ? (
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                          <span className="text-2xl">{service.icon}</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                          <IconCode className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {name}
                      </h3>
                      {description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noServices")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
