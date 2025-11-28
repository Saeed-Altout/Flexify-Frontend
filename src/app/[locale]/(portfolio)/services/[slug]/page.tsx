import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailClient } from "./_components/service-detail-client";
import {
  generateSeoMetadata,
  generateServiceStructuredData,
  generateProfessionalServiceStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { getServiceBySlugServer } from "@/lib/server-api";
import { getBaseUrl, getOgImageUrl } from "@/lib/seo";
import type { IServiceTranslation } from "@/modules/services/services-type";

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
  const translation = service?.translations?.find(
    (t: IServiceTranslation) => t.locale === locale
  );

  const title =
    translation?.name || t("title", { slug }) || "Service";
  const description =
    translation?.description ||
    t("description") ||
    "Professional web development service";

  const image = service?.imageUrl;
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
  const translation = service?.translations?.find(
    (t: IServiceTranslation) => t.locale === locale
  );

  const structuredDataArray = [];
  
  if (service && translation) {
    const serviceUrl = `${baseUrl}/${locale !== "en" ? `${locale}/` : ""}services/${slug}`;
    const t = await getTranslations("portfolio");
    
    // Professional Service structured data (more comprehensive)
    structuredDataArray.push(
      generateProfessionalServiceStructuredData({
        name: translation.name,
        description: translation.description || "",
        url: serviceUrl,
        provider: {
          name: "Saeed Altout",
          url: baseUrl,
          jobTitle: "Frontend Developer",
        },
        areaServed: "SY",
        serviceType: "WebDevelopment",
      })
    );

    // Breadcrumb structured data
    structuredDataArray.push(
      generateBreadcrumbStructuredData([
        { name: t("navbar.home") || "Home", url: baseUrl },
        {
          name: t("navbar.services") || "Services",
          url: `${baseUrl}/${locale !== "en" ? `${locale}/` : ""}services`,
        },
        {
          name: translation.name,
          url: serviceUrl,
        },
      ])
    );
  }

  return (
    <>
      {structuredDataArray.length > 0 && (
        <StructuredData data={structuredDataArray} />
      )}
      <ServiceDetailClient slug={slug} />
    </>
  );
}

