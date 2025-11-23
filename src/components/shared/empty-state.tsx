import { useTranslations } from "next-intl";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyTitle,
  EmptyActions,
} from "@/components/ui/empty";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "search" | "error";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const t = useTranslations("common");

  const defaultConfig = {
    default: {
      title: title || t("noResults"),
      description: description || "",
    },
    search: {
      title: title || t("noResults"),
      description: description || t("tryAgain"),
    },
    error: {
      title: title || t("someThingWentWrong"),
      description: description || t("tryAgain"),
    },
  };

  const config = defaultConfig[variant];

  return (
    <Empty className="min-h-[400px]">
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon className="h-12 w-12 text-muted-foreground" />
          </EmptyMedia>
        )}
        <EmptyTitle>{config.title}</EmptyTitle>
        {config.description && (
          <EmptyDescription>{config.description}</EmptyDescription>
        )}
        {onAction && actionLabel && (
          <EmptyActions>
            <Button onClick={onAction} variant="outline">
              {actionLabel}
            </Button>
          </EmptyActions>
        )}
      </EmptyHeader>
    </Empty>
  );
}

