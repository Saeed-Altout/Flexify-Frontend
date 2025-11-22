import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceForm } from "../_components/service-form";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.services.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CreateServicePage() {
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title="Create Service"
        description="Add a new service to the system"
      />
      <ServiceForm mode="create" />
    </div>
  );
}

