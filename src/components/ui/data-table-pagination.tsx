"use client";

import { useTranslations } from "next-intl";

import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { IPaginationMeta } from "@/types/api-type";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function DataTablePagination({
  meta,
  onPageChange,
  onPageLimitChange,
}: {
  meta: IPaginationMeta;
  onPageChange?: (page: number) => void;
  onPageLimitChange?: (limit: number) => void;
}) {
  const t = useTranslations("common");
  const { page, limit, totalPages, isNextPage, isPrevPage } = meta;

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {t("page")} {page} {t("of")} {totalPages} {t("pages")}.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            {t("rowsPerPage")}
          </Label>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              onPageLimitChange?.(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {t("page")} {page} {t("of")} {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange?.(1)}
            disabled={!isPrevPage}
          >
            <span className="sr-only">{t("goToFirstPage")}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange?.(page - 1)}
            disabled={!isPrevPage}
          >
            <span className="sr-only">{t("goToPreviousPage")}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange?.(page + 1)}
            disabled={!isNextPage}
          >
            <span className="sr-only">{t("goToNextPage")}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageChange?.(totalPages)}
            disabled={!isNextPage}
          >
            <span className="sr-only">{t("goToLastPage")}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
