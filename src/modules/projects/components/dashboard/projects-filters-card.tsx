"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Code, Filter, X, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectsFiltersCardProps {
  search: string;
  onSearchChange: (value: string | null) => void;
  techStack: string | null;
  onTechStackChange: (value: string | null) => void;
  isPublished: string | null;
  onIsPublishedChange: (value: string | null) => void;
  onClearFilters: () => void;
  onPageReset: () => void;
}

export function ProjectsFiltersCard({
  search,
  onSearchChange,
  techStack,
  onTechStackChange,
  isPublished,
  onIsPublishedChange,
  onClearFilters,
  onPageReset,
}: ProjectsFiltersCardProps) {
  const tDashboard = useTranslations("auth.projects.dashboard");

  const handleClearFilters = () => {
    onClearFilters();
    onPageReset();
  };

  const hasActiveFilters = Boolean(search || techStack || isPublished);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{tDashboard("filters")}</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("filtersTooltip") ||
                    "Filter projects by search, tech stack, or status"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={tDashboard("searchPlaceholder")}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value || null)}
                    className="pl-9"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("searchTooltip") ||
                    "Search by project title or description"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={tDashboard("techStackPlaceholder")}
                    value={techStack || ""}
                    onChange={(e) => onTechStackChange(e.target.value || null)}
                    className="pl-9"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("techStackTooltip") ||
                    "Filter by technology (e.g., React, Node.js)"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Select
                  value={isPublished || "all"}
                  onValueChange={(value) =>
                    onIsPublishedChange(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tDashboard("status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tDashboard("allStatus")}</SelectItem>
                    <SelectItem value="true">{tDashboard("published")}</SelectItem>
                    <SelectItem value="false">{tDashboard("draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("statusTooltip") || "Filter by publication status"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto"
                  disabled={!hasActiveFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  {tDashboard("clearFilters")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tDashboard("clearFiltersTooltip") || "Reset all filters"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

