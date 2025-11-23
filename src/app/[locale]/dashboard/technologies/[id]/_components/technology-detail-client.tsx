"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTechnologyQuery } from "@/modules/technologies/technologies-hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { getIconComponent } from "@/utils/icon-utils";

interface TechnologyDetailClientProps {
  id: string;
}

export function TechnologyDetailClient({ id }: TechnologyDetailClientProps) {
  const t = useTranslations("dashboard.technologies.detail");
  const router = useRouter();
  const { data, isLoading, isError } = useTechnologyQuery(id);

  if (isLoading) {
    return <LoadingState title={t("loading.title")} description={t("loading.description")} />;
  }

  if (isError || !data?.data?.data) {
    return <ErrorState title={t("error.title")} description={t("error.description")} />;
  }

  const technology = data.data.data;
  const IconComponent = getIconComponent(technology.icon);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{technology.name}</h1>
          <p className="text-muted-foreground mt-1">{technology.slug}</p>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/technologies/${id}/edit`)}
          className="w-full sm:w-auto"
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("technologyInfo") || "Technology Information"}</CardTitle>
            <CardDescription>
              {t("technologyInfoDescription") || "Basic information about the technology"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("slug") || "Slug"}
              </label>
              <p className="mt-1 text-sm font-medium">
                <code className="rounded bg-muted px-2 py-1">{technology.slug}</code>
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("name") || "Name"}
              </label>
              <p className="mt-1 text-sm font-medium">{technology.name}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("icon") || "Icon"}
              </label>
              <div className="mt-1">
                {IconComponent ? (
                  <IconComponent className="h-6 w-6" />
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("description") || "Description"}
              </label>
              <p className="mt-1 text-sm text-muted-foreground">
                {technology.description || "-"}
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("category") || "Category"}
              </label>
              <div className="mt-1">
                {technology.category ? (
                  <Badge variant="outline">{technology.category}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("orderIndex") || "Order Index"}
              </label>
              <p className="mt-1 text-sm font-medium">{technology.orderIndex}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("metadataLabel") || "Metadata"}</CardTitle>
            <CardDescription>
              {t("metadataDescription") || "Additional information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("createdAt") || "Created At"}
              </label>
              <p className="mt-1 text-sm font-medium">
                {format(new Date(technology.createdAt), "PPpp")}
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("updatedAt") || "Updated At"}
              </label>
              <p className="mt-1 text-sm font-medium">
                {format(new Date(technology.updatedAt), "PPpp")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

