"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCategoryQuery } from "@/modules/categories/categories-hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { getIconComponent } from "@/utils/icon-utils";

interface CategoryDetailClientProps {
  id: string;
}

export function CategoryDetailClient({ id }: CategoryDetailClientProps) {
  const t = useTranslations("dashboard.categories.detail");
  const router = useRouter();
  const { data, isLoading, isError } = useCategoryQuery(id);

  if (isLoading) {
    return <LoadingState title={t("loading.title")} description={t("loading.description")} />;
  }

  if (isError || !data?.data?.data) {
    return <ErrorState title={t("error.title")} description={t("error.description")} />;
  }

  const category = data.data.data;
  const IconComponent = getIconComponent(category.icon);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{category.slug}</p>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/categories/${id}/edit`)}
          className="w-full sm:w-auto"
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("categoryInfo") || "Category Information"}</CardTitle>
            <CardDescription>
              {t("categoryInfoDescription") || "Basic information about the category"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("slug") || "Slug"}
              </label>
              <p className="mt-1 text-sm font-medium">
                <code className="rounded bg-muted px-2 py-1">{category.slug}</code>
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("name") || "Name"}
              </label>
              <p className="mt-1 text-sm font-medium">{category.name}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("description") || "Description"}
              </label>
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description || "-"}
              </p>
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
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("orderIndex") || "Order Index"}
              </label>
              <p className="mt-1 text-sm font-medium">{category.orderIndex}</p>
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
                {format(new Date(category.createdAt), "PPpp")}
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("updatedAt") || "Updated At"}
              </label>
              <p className="mt-1 text-sm font-medium">
                {format(new Date(category.updatedAt), "PPpp")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

