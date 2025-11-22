import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InquiryTypeForm } from "../_components/inquiry-type-form";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.inquiryTypes.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CreateInquiryTypePage() {
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title="Create Inquiry Type"
        description="Add a new inquiry type to the system"
      />
      <InquiryTypeForm mode="create" />
    </div>
  );
}

