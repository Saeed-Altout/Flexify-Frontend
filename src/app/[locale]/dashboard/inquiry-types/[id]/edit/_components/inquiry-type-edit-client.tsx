"use client";

import { useInquiryTypeQuery } from "@/modules/inquiry-types/inquiry-types-hook";
import { InquiryTypeForm } from "../../../_components/inquiry-type-form";
import { Heading } from "@/components/ui/heading";
import { useTranslations } from "next-intl";

interface InquiryTypeEditClientProps {
  id: string;
}

export function InquiryTypeEditClient({ id }: InquiryTypeEditClientProps) {
  const t = useTranslations("dashboard.inquiryTypes.edit");
  const { data, isLoading } = useInquiryTypeQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const inquiryType = data?.data?.data;
  if (!inquiryType) {
    return <div>Inquiry type not found</div>;
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading title={t("title")} description={t("description")} />
      <InquiryTypeForm inquiryType={inquiryType} mode="edit" />
    </div>
  );
}

