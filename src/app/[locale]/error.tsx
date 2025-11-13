"use client";

import { useTranslations } from "next-intl";
import { AlertTriangleIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { RestButton } from "@/components/buttons/reset-button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="h-screen flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>{t("someThingWentWrong")}</EmptyTitle>
          <EmptyDescription>
            {error.message || t("someThingWentWrong")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <RestButton reset={reset} />
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
