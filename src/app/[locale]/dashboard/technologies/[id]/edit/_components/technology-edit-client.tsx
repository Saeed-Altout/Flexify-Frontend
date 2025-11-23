"use client";

import { useTechnologyQuery } from "@/modules/technologies/technologies-hook";
import { TechnologyForm } from "../../../_components/technology-form";
import { Heading } from "@/components/ui/heading";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTranslations } from "next-intl";

interface TechnologyEditClientProps {
  id: string;
}

export function TechnologyEditClient({ id }: TechnologyEditClientProps) {
  const t = useTranslations("dashboard.technologies.edit");
  const { data, isLoading, isError } = useTechnologyQuery(id);

  if (isLoading) {
    return <LoadingState title={t("loading.title")} description={t("loading.description")} />;
  }

  if (isError || !data?.data?.data) {
    return <ErrorState title={t("error.title")} description={t("error.description")} />;
  }

  const technology = data.data.data;

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title={t("title")}
        description={t("description")}
      />
      <TechnologyForm technology={technology} mode="edit" />
    </div>
  );
}

