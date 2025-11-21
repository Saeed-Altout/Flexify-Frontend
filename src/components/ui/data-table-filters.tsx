import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function DataTableFilter({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FilterIcon />
          <span className="sr-only">{t("filters")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:max-w-md">
        <SheetHeader className="pb-0">
          <SheetTitle>{t("filtersTitle")}</SheetTitle>
          <SheetDescription>{t("filtersDescription")}</SheetDescription>
        </SheetHeader>
        <div className="px-4 py-2 space-y-6 h-[75vh] overflow-y-auto">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
