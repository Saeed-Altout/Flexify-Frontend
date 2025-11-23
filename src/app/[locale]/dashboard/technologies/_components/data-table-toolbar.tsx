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
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
}: DataTableToolbarProps) {
  const t = useTranslations("dashboard.technologies.toolbar");

  const isFiltered = searchValue || categoryFilter !== "all";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="h-8 w-full sm:w-[130px]">
            <SelectValue placeholder={t("categoryFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onSearchChange("");
              onCategoryFilterChange("all");
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

