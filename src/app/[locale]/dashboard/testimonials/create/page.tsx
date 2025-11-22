import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TestimonialForm } from "../_components/testimonial-form";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.testimonials.create.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CreateTestimonialPage() {
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title="Create Testimonial"
        description="Add a new testimonial to the system"
      />
      <TestimonialForm mode="create" />
    </div>
  );
}

