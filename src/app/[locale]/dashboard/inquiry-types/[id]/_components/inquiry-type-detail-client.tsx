"use client";

import { useInquiryTypeQuery } from "@/modules/inquiry-types/inquiry-types-hook";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface InquiryTypeDetailClientProps {
  id: string;
}

export function InquiryTypeDetailClient({ id }: InquiryTypeDetailClientProps) {
  const t = useTranslations("dashboard.inquiryTypes.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useInquiryTypeQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const inquiryType = data?.data?.data;
  if (!inquiryType) {
    return <div>Inquiry type not found</div>;
  }

  const translation = inquiryType.translations?.find(
    (t) => t.locale === locale
  );
  const fallbackTranslation = inquiryType.translations?.[0];
  const name = translation?.name || fallbackTranslation?.name || inquiryType.slug;
  const description = translation?.description || fallbackTranslation?.description || undefined;

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/inquiry-types")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Heading title={name} description={description} />
        </div>
        <Button
          onClick={() => router.push(`/dashboard/inquiry-types/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("slug")}
            </h3>
            <p className="mt-1 font-mono text-sm">{inquiryType.slug}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("status")}
            </h3>
            <div className="mt-1">
              <Badge variant={inquiryType.isActive ? "default" : "secondary"}>
                {inquiryType.isActive ? t("active") : t("inactive")}
              </Badge>
            </div>
          </div>
          {inquiryType.icon && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("icon")}
              </h3>
              <p className="mt-1 text-lg">{inquiryType.icon}</p>
            </div>
          )}
          {inquiryType.color && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("color")}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded border"
                  style={{ backgroundColor: inquiryType.color }}
                />
                <span className="font-mono text-sm">{inquiryType.color}</span>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("orderIndex")}
            </h3>
            <p className="mt-1">{inquiryType.orderIndex}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("createdAt")}
            </h3>
            <p className="mt-1">
              {format(new Date(inquiryType.createdAt), "PPpp")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("updatedAt")}
            </h3>
            <p className="mt-1">
              {format(new Date(inquiryType.updatedAt), "PPpp")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("translations")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {inquiryType.translations?.map((translation) => (
            <div key={translation.id} className="rounded-lg border p-4">
              <div className="mb-2">
                <Badge variant="outline" className="uppercase">
                  {translation.locale}
                </Badge>
              </div>
              <h4 className="font-semibold">{translation.name}</h4>
              {translation.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {translation.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

