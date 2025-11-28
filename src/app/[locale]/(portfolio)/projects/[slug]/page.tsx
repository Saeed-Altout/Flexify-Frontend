import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectDetailsClient } from "./_components/project-details-client";
import {
  generateSeoMetadata,
  generateProjectStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { getProjectBySlugServer } from "@/lib/server-api";
import { getBaseUrl, getOgImageUrl } from "@/lib/seo";
import type {
  IProjectTranslation,
  ITechnology,
  ICategory,
} from "@/modules/projects/projects-type";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations("portfolio.projectDetails");

  // Fetch project data for metadata
  const project = await getProjectBySlugServer(slug, locale);
  const translation = project?.translations?.find(
    (t: IProjectTranslation) => t.locale === locale
  );

  const title = translation?.title || project?.title || "Project";
  const description =
    translation?.shortDescription ||
    translation?.description ||
    project?.description ||
    t("description") ||
    "Explore this project";

  const thumbnail = project?.thumbnail_url;
  const ogImage = thumbnail ? getOgImageUrl(thumbnail) : getOgImageUrl();

  return generateSeoMetadata({
    title,
    description,
    keywords: [
      ...(project?.technologies?.map((tech: ITechnology) => tech.name) || []),
      ...(project?.categories?.map((cat: ICategory) => cat.name) || []),
      "Project",
      "Portfolio",
      "Web Development",
    ],
    path: `/projects/${slug}`,
    locale,
    image: ogImage,
    type: "article",
    publishedTime: project?.created_at,
    modifiedTime: project?.updated_at,
  });
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const baseUrl = getBaseUrl();

  // Fetch project for structured data
  const project = await getProjectBySlugServer(slug, locale);
  const translation = project?.translations?.find(
    (t: IProjectTranslation) => t.locale === locale
  );

  const structuredDataArray = [];

  if (project && translation) {
    const projectUrl = `${baseUrl}/${
      locale !== "en" ? `${locale}/` : ""
    }projects/${slug}`;

    // Project structured data
    structuredDataArray.push(
      generateProjectStructuredData({
        name: translation.title || project.title,
        description:
          translation.shortDescription ||
          translation.description ||
          project.description,
        url: projectUrl,
        image: project.thumbnail_url
          ? getOgImageUrl(project.thumbnail_url)
          : undefined,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        aggregateRating:
          project.likeCount > 0
            ? {
                ratingValue: 5,
                ratingCount: project.likeCount,
              }
            : undefined,
      })
    );

    // Breadcrumb structured data
    const t = await getTranslations("portfolio");
    structuredDataArray.push(
      generateBreadcrumbStructuredData([
        { name: t("navbar.home") || "Home", url: baseUrl },
        {
          name: t("navbar.projects") || "Projects",
          url: `${baseUrl}/${locale !== "en" ? `${locale}/` : ""}projects`,
        },
        {
          name: translation.title || project.title,
          url: projectUrl,
        },
      ])
    );
  }

  return (
    <>
      {structuredDataArray.length > 0 && (
        <StructuredData data={structuredDataArray} />
      )}
      <ProjectDetailsClient params={Promise.resolve({ slug })} />
    </>
  );
}
