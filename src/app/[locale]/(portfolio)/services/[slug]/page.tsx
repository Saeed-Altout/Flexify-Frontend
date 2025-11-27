import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailClient } from "./_components/service-detail-client";
import { generateSeoMetadata, generateServiceStructuredData } from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { getServiceBySlugServer } from "@/lib/server-api";
import { getBaseUrl, getOgImageUrl } from "@/lib/seo";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations("portfolio.services.detail.metadata");

  // Fetch service data for metadata
  const service = await getServiceBySlugServer(slug, locale);
  const translation = service?.translations?.find((t) => t.locale === locale);

  const title =
    translation?.title || service?.title || t("title", { slug }) || "Service";
  const description =
    translation?.description ||
    service?.description ||
    t("description") ||
    "Professional web development service";

  const image = service?.image_url;
  const ogImage = image ? getOgImageUrl(image) : getOgImageUrl();

  return generateSeoMetadata({
    title,
    description,
    keywords: [
      title,
      "Service",
      "Web Development",
      "Professional Services",
      "Consultation",
    ],
    path: `/services/${slug}`,
    locale,
    image: ogImage,
    type: "website",
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug, locale } = await params;
  const baseUrl = getBaseUrl();

  // Fetch service for structured data
  const service = await getServiceBySlugServer(slug, locale);
  const translation = service?.translations?.find((t) => t.locale === locale);

  let structuredData = null;
  if (service && translation) {
    structuredData = generateServiceStructuredData({
      name: translation.title || service.title,
      description: translation.description || service.description,
      url: `${baseUrl}/${locale !== "en" ? `${locale}/` : ""}services/${slug}`,
      provider: {
        name: "Flexify",
        url: baseUrl,
      },
      serviceType: "WebDevelopment",
    });
  }

  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
      <ServiceDetailClient slug={slug} />
    </>
  );
}

