"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/constants/routes";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();
  const t = useTranslations("common");

  const handleRoute = () => {
    router.push(Routes.home);
  };

  return (
    <Button variant="outline" onClick={handleRoute}>
      <ArrowLeftIcon />
      {t("backToPrevious")}
    </Button>
  );
}
