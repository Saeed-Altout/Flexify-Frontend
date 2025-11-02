"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function RestButton({ reset }: { reset: () => void }) {
  const t = useTranslations("common");

  const handleRoute = () => reset();

  return (
    <Button variant="outline" onClick={handleRoute}>
      <ArrowLeftIcon />
      {t("backToPrevious")}
    </Button>
  );
}
