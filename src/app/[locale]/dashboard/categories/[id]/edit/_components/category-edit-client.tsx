"use client";

import { useCategoryQuery } from "@/modules/categories/categories-hook";
import { CategoryForm } from "../../../_components/category-form";
import { Heading } from "@/components/ui/heading";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTranslations } from "next-intl";

interface CategoryEditClientProps {
  id: string;
}

export function CategoryEditClient({ id }: CategoryEditClientProps) {
  const t = useTranslations("dashboard.categories.edit");
  const { data, isLoading, isError } = useCategoryQuery(id);

  if (isLoading) {
    return <LoadingState title={t("loading.title")} description={t("loading.description")} />;
  }

  if (isError || !data?.data?.data) {
    return <ErrorState title={t("error.title")} description={t("error.description")} />;
  }

  const category = data.data.data;

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title={t("title")}
        description={t("description")}
      />
      <CategoryForm category={category} mode="edit" />
    </div>
  );
}

