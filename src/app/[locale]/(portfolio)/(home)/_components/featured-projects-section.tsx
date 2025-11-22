"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useProjectsQuery } from "@/modules/projects/projects-hook";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { IconArrowRight } from "@tabler/icons-react";

export function FeaturedProjectsSection() {
  const t = useTranslations("portfolio.home.featuredProjects");
  const locale = useLocale();

  const { data, isLoading } = useProjectsQuery({
    isFeatured: true,
    status: "published",
    locale,
    limit: 6,
    sortBy: "order_index",
    sortOrder: "asc",
  });

  const projects = data?.data?.data || [];

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t("title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("description")}
          </p>
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/projects">
              {t("viewAll")}
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

