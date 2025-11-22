"use client";

import { useServiceBySlugQuery } from "@/modules/services/services-hook";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { IconCode } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface ServiceDetailClientProps {
  slug: string;
}

export function ServiceDetailClient({ slug }: ServiceDetailClientProps) {
  const t = useTranslations("portfolio.services.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useServiceBySlugQuery(slug);

  if (isLoading) {
    return (
      <main className="py-16 px-4">
        <div className="container max-w-4xl">
          <div className="h-96 bg-muted animate-pulse rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  const service = data?.data?.data;
  if (!service) {
    return (
      <main className="py-16 px-4">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">{t("notFound")}</h1>
          <Button onClick={() => router.push("/services")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToServices")}
          </Button>
        </div>
      </main>
    );
  }

  const translation = service.translations?.find((t) => t.locale === locale);
  const fallbackTranslation = service.translations?.[0];
  const name =
    translation?.name || fallbackTranslation?.name || service.slug;
  const description =
    translation?.description ||
    fallbackTranslation?.description ||
    "";
  const content =
    translation?.content ||
    fallbackTranslation?.content ||
    "";

  return (
    <main className="py-16 px-4">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/services")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToServices")}
          </Button>

          {service.imageUrl && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={service.imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-start gap-4 mb-6">
            {service.icon && !service.imageUrl && (
              <div className="p-4 rounded-lg bg-primary/10 text-primary">
                <span className="text-4xl">{service.icon}</span>
              </div>
            )}
            {!service.icon && !service.imageUrl && (
              <div className="p-4 rounded-lg bg-primary/10 text-primary">
                <IconCode className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {name}
                </h1>
                {service.isFeatured && (
                  <Badge variant="default">{t("featured")}</Badge>
                )}
              </div>
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>
          </div>

          {content && (
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {!content && description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{description}</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

