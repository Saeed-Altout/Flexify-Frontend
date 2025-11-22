"use client";

import { useServiceQuery } from "@/modules/services/services-hook";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { IconCode } from "@tabler/icons-react";

interface ServiceDetailClientProps {
  id: string;
}

export function ServiceDetailClient({ id }: ServiceDetailClientProps) {
  const t = useTranslations("dashboard.services.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useServiceQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const service = data?.data?.data;
  if (!service) {
    return <div>Service not found</div>;
  }

  const translation = service.translations?.find((t) => t.locale === locale);
  const fallbackTranslation = service.translations?.[0];
  const name = translation?.name || fallbackTranslation?.name || service.slug;
  const description =
    translation?.description || fallbackTranslation?.description || "";

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/services")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Heading title={name} description={description || undefined} />
        </div>
        <Button
          onClick={() => router.push(`/dashboard/services/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {service.imageUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("image")}
              </h3>
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {service.icon && !service.imageUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("icon")}
              </h3>
              <div className="p-4 rounded-lg bg-primary/10 text-primary w-fit">
                <span className="text-4xl">{service.icon}</span>
              </div>
            </div>
          )}
          {!service.icon && !service.imageUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("icon")}
              </h3>
              <div className="p-4 rounded-lg bg-primary/10 text-primary w-fit">
                <IconCode className="w-8 h-8" />
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("slug")}
            </h3>
            <p className="font-mono text-sm">{service.slug}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("status")}
            </h3>
            <div className="flex gap-2">
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? t("active") : t("inactive")}
              </Badge>
              {service.isFeatured && (
                <Badge variant="default">{t("featured")}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {service.color && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("color")}
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded border"
                  style={{ backgroundColor: service.color }}
                />
                <span className="font-mono text-sm">{service.color}</span>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("orderIndex")}
            </h3>
            <p>{service.orderIndex}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("createdAt")}
            </h3>
            <p>{format(new Date(service.createdAt), "PPpp")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("updatedAt")}
            </h3>
            <p>{format(new Date(service.updatedAt), "PPpp")}</p>
          </div>
        </div>
      </div>

      {translation?.content && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("content")}</h3>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("translations")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {service.translations?.map((translation) => (
            <div key={translation.id} className="rounded-lg border p-4">
              <div className="mb-2">
                <Badge variant="outline" className="uppercase">
                  {translation.locale}
                </Badge>
              </div>
              <h4 className="font-semibold mb-2">{translation.name}</h4>
              {translation.shortDescription && (
                <p className="text-sm text-muted-foreground mb-2">
                  {translation.shortDescription}
                </p>
              )}
              {translation.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {translation.description}
                </p>
              )}
              {translation.metaTitle && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Meta Title:</strong> {translation.metaTitle}
                </div>
              )}
              {translation.metaDescription && (
                <div className="mt-1 text-xs text-muted-foreground">
                  <strong>Meta Description:</strong> {translation.metaDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

