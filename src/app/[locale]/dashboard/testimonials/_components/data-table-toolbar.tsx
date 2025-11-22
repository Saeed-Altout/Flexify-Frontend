"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  approvedFilter: string;
  onApprovedFilterChange: (value: string) => void;
  featuredFilter: string;
  onFeaturedFilterChange: (value: string) => void;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  approvedFilter,
  onApprovedFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
}: DataTableToolbarProps) {
  const t = useTranslations("dashboard.testimonials.toolbar");

  const isFiltered =
    searchValue || approvedFilter !== "all" || featuredFilter !== "all";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />

        <Select value={approvedFilter} onValueChange={onApprovedFilterChange}>
          <SelectTrigger className="h-8 w-full sm:w-[130px]">
            <SelectValue placeholder={t("approvedFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="true">{t("approved")}</SelectItem>
            <SelectItem value="false">{t("pending")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={onFeaturedFilterChange}>
          <SelectTrigger className="h-8 w-full sm:w-[130px]">
            <SelectValue placeholder={t("featuredFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="true">{t("featured")}</SelectItem>
            <SelectItem value="false">{t("notFeatured")}</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onSearchChange("");
              onApprovedFilterChange("all");
              onFeaturedFilterChange("all");
            }}
            className="h-8 w-full px-2 sm:w-auto lg:px-3"
          >
            {t("reset")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

