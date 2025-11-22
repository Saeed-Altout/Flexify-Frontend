"use client";

import { useTestimonialQuery } from "@/modules/testimonials/testimonials-hook";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialDetailClientProps {
  id: string;
}

export function TestimonialDetailClient({ id }: TestimonialDetailClientProps) {
  const t = useTranslations("dashboard.testimonials.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useTestimonialQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const testimonial = data?.data?.data;
  if (!testimonial) {
    return <div>Testimonial not found</div>;
  }

  const translation = testimonial.translations?.find(
    (t) => t.locale === locale
  );
  const fallbackTranslation = testimonial.translations?.[0];
  const content =
    translation?.content || fallbackTranslation?.content || "";
  const authorName =
    translation?.authorName || fallbackTranslation?.authorName || "";
  const authorPosition =
    translation?.authorPosition || fallbackTranslation?.authorPosition || "";
  const company =
    translation?.company || fallbackTranslation?.company || "";

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/testimonials")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Heading title={authorName} description={authorPosition || company || undefined} />
        </div>
        <Button
          onClick={() => router.push(`/dashboard/testimonials/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {testimonial.avatarUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("avatar")}
              </h3>
              <Avatar className="h-24 w-24">
                <AvatarImage src={testimonial.avatarUrl} alt={authorName} />
                <AvatarFallback>{authorName[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
          {testimonial.rating && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("rating")}
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
                <span className="ml-2">({testimonial.rating}/5)</span>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("status")}
            </h3>
            <div className="flex gap-2">
              <Badge variant={testimonial.isApproved ? "default" : "secondary"}>
                {testimonial.isApproved ? t("approved") : t("pending")}
              </Badge>
              {testimonial.isFeatured && (
                <Badge variant="default">{t("featured")}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("orderIndex")}
            </h3>
            <p>{testimonial.orderIndex}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("createdAt")}
            </h3>
            <p>{format(new Date(testimonial.createdAt), "PPpp")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("updatedAt")}
            </h3>
            <p>{format(new Date(testimonial.updatedAt), "PPpp")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("content")}</h3>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("translations")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonial.translations?.map((translation) => (
            <div key={translation.id} className="rounded-lg border p-4">
              <div className="mb-2">
                <Badge variant="outline" className="uppercase">
                  {translation.locale}
                </Badge>
              </div>
              <h4 className="font-semibold mb-1">{translation.authorName}</h4>
              {translation.authorPosition && (
                <p className="text-sm text-muted-foreground mb-1">
                  {translation.authorPosition}
                </p>
              )}
              {translation.company && (
                <p className="text-sm text-muted-foreground mb-2">
                  {translation.company}
                </p>
              )}
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {translation.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

