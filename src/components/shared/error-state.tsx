import { AlertTriangleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ErrorState({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <Empty className="min-h-[500px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title || t("error")}</EmptyTitle>
        <EmptyDescription>
          {description || t("someThingWentWrong")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={() => router.refresh()}>
          {t("tryAgain")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
