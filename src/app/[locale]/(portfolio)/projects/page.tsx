import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectsPageClient } from "./_components/projects-page-client";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.projects");

  return generateSeoMetadata({
    title: t("title") || "Projects",
    description: t("description") || "Explore my portfolio of web development projects built with modern technologies.",
    keywords: [
      "Projects",
      "Portfolio",
      "Web Development Projects",
      "Next.js Projects",
      "React Projects",
      "Full Stack Projects",
    ],
    path: "/projects",
    locale,
    type: "website",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <ProjectsPageClient />;
}

