"use client";

import { useTestimonialQuery } from "@/modules/testimonials/testimonials-hook";
import { TestimonialForm } from "../../../_components/testimonial-form";
import { Heading } from "@/components/ui/heading";
import { useTranslations } from "next-intl";

interface TestimonialEditClientProps {
  id: string;
}

export function TestimonialEditClient({ id }: TestimonialEditClientProps) {
  const t = useTranslations("dashboard.testimonials.edit");
  const { data, isLoading } = useTestimonialQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const testimonial = data?.data?.data;
  if (!testimonial) {
    return <div>Testimonial not found</div>;
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading title={t("title")} description={t("description")} />
      <TestimonialForm testimonial={testimonial} mode="edit" />
    </div>
  );
}

