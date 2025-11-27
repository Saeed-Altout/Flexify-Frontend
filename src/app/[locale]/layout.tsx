import type { Metadata } from "next";
import { Poppins, Cairo } from "next/font/google";
import "../globals.css";

import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { ReactQueryProviders } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/utils";
import { getDir } from "@/utils/get-dir";
import { getBaseUrl, getOgImageUrl } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const baseUrl = getBaseUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Flexify - Full Stack Developer Portfolio",
    template: "%s | Flexify",
  },
  description:
    "Full Stack Developer building modern web applications with Next.js, NestJS, TypeScript, and cutting-edge technologies. Expert in React, Node.js, and cloud architecture.",
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "NestJS",
    "TypeScript",
    "React",
    "Portfolio",
    "Web Development",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Node.js",
    "JavaScript",
  ],
  authors: [{ name: "Flexify", url: baseUrl }],
  creator: "Flexify",
  publisher: "Flexify",
  applicationName: "Flexify Portfolio",
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    siteName: "Flexify Portfolio",
    url: baseUrl,
    title: "Flexify - Full Stack Developer Portfolio",
    description:
      "Full Stack Developer building modern web applications with Next.js, NestJS, TypeScript, and cutting-edge technologies.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Flexify Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flexify - Full Stack Developer Portfolio",
    description:
      "Full Stack Developer building modern web applications with Next.js, NestJS, TypeScript, and cutting-edge technologies.",
    images: [ogImage],
    creator: "@flexify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: baseUrl,
      ar: `${baseUrl}/ar`,
    },
  },
  category: "technology",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={getDir(locale)} suppressHydrationWarning>
      <body
        className={cn(
          "antialiased isolate",
          locale === "ar" ? cairo.className : poppins.className
        )}
      >
        <ReactQueryProviders>
          <NuqsAdapter>
            <NextIntlClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster position="top-center" />
              </ThemeProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
