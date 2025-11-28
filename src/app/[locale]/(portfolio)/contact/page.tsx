import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactSection } from "./_components/contact-section";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.contact");
  const seoT = await getTranslations("portfolio.seo.contact");

  return generateSeoMetadata({
    title: t("title") || "Contact",
    description:
      t("description") ||
      "Get in touch with me for your next web development project.",
    keywords: seoT.raw("keywords") as string[],
    path: "/contact",
    locale,
    type: "website",
  });
}

export default function ContactPage() {
  return (
    <main className="container">
      <ContactSection />
    </main>
  );
}

