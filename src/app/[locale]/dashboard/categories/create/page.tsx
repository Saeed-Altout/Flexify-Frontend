import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryForm } from "../_components/category-form";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.categories.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CreateCategoryPage() {
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title="Create Category"
        description="Add a new category to the system"
      />
      <CategoryForm mode="create" />
    </div>
  );
}

