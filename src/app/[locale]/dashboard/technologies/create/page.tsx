import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TechnologyForm } from "../_components/technology-form";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.technologies.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CreateTechnologyPage() {
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title="Create Technology"
        description="Add a new technology to the system"
      />
      <TechnologyForm mode="create" />
    </div>
  );
}

