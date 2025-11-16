import { useTranslations } from "next-intl";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function LoadingState({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const t = useTranslations("common");

  return (
    <Empty className="min-h-[500px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner size="md" />
        </EmptyMedia>
        <EmptyTitle>{title || t("loading")}</EmptyTitle>
        <EmptyDescription>
          {description || t("loadingDescription")}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
