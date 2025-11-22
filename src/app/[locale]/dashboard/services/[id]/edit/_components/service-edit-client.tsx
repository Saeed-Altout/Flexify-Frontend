"use client";

import { useServiceQuery } from "@/modules/services/services-hook";
import { ServiceForm } from "../../../_components/service-form";
import { Heading } from "@/components/ui/heading";
import { useTranslations } from "next-intl";

interface ServiceEditClientProps {
  id: string;
}

export function ServiceEditClient({ id }: ServiceEditClientProps) {
  const t = useTranslations("dashboard.services.edit");
  const { data, isLoading } = useServiceQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const service = data?.data?.data;
  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading title={t("title")} description={t("description")} />
      <ServiceForm service={service} mode="edit" />
    </div>
  );
}

