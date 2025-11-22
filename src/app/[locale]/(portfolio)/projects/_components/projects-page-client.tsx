"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useProjectsQuery, useCategoriesQuery } from "@/modules/projects/projects-hook";
import { ProjectCard } from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import type { ProjectType, ProjectStatus } from "@/modules/projects/projects-type";
import { cn } from "@/lib/utils";

export function ProjectsPageClient() {
  const t = useTranslations("portfolio.projects");
  const locale = useLocale();

  // Filters state
  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "all">("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Queries
  const { data: projectsData, isLoading } = useProjectsQuery({
    search: search || undefined,
    projectType: projectType !== "all" ? projectType : undefined,
    categoryId: categoryId !== "all" ? categoryId : undefined,
    status: "published",
    locale,
    page,
    limit,
    sortBy: "order_index",
    sortOrder: "asc",
  });

  const { data: categoriesData } = useCategoriesQuery();

  const projects = projectsData?.data?.data || [];
  const meta = projectsData?.data?.meta;
  const categories = categoriesData?.data?.data?.categories || [];

  // Helper function to get project type translation key
  const getProjectTypeKey = (type: ProjectType): "personal" | "client" | "openSource" => {
    if (type === "open_source") return "openSource";
    return type;
  };

  // Clear filters
  const hasActiveFilters = search || projectType !== "all" || categoryId !== "all";
  const clearFilters = () => {
    setSearch("");
    setProjectType("all");
    setCategoryId("all");
    setPage(1);
  };

  // Pagination
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <main className="container py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-10"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <IconFilter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("filters")}:
            </span>
          </div>

          {/* Project Type Filter */}
          <Select
            value={projectType}
            onValueChange={(value) => {
              setProjectType(value as ProjectType | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("projectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="personal">{t("personal")}</SelectItem>
              <SelectItem value="client">{t("client")}</SelectItem>
              <SelectItem value="open_source">{t("openSource")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {locale === "ar" ? category.nameAr : category.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              <IconX className="w-4 h-4 mr-2" />
              {t("clearFilters")}
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("activeFilters")}:</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                {t("search")}: {search}
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {projectType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t("type")}: {t(getProjectTypeKey(projectType))}
                <button
                  onClick={() => {
                    setProjectType("all");
                    setPage(1);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {categoryId !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t("category")}:{" "}
                {locale === "ar"
                  ? categories.find((c) => c.id === categoryId)?.nameAr
                  : categories.find((c) => c.id === categoryId)?.nameEn}
                <button
                  onClick={() => {
                    setCategoryId("all");
                    setPage(1);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* Results Count */}
      {meta && (
        <div className="mb-6 text-sm text-muted-foreground">
          {t("showing")}{" "}
          {meta.total > 0
            ? `${(meta.page - 1) * meta.limit + 1} - ${Math.min(meta.page * meta.limit, meta.total)}`
            : "0 - 0"}{" "}
          {t("of")} {meta.total} {t("projects")}
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-lg text-muted-foreground mb-4">{t("noProjects")}</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canGoPrev}
          >
            <IconChevronLeft className="w-4 h-4" />
            {t("previous")}
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "min-w-[40px]",
                    page === pageNum && "pointer-events-none"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canGoNext}
          >
            {t("next")}
            <IconChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </main>
  );
}

