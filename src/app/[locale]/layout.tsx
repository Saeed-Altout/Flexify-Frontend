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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Flexify - Full Stack Developer Portfolio",
    template: "%s | Flexify",
  },
  description:
    "Full Stack Developer building modern web applications with Next.js, NestJS, TypeScript, and cutting-edge technologies.",
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "NestJS",
    "TypeScript",
    "React",
    "Portfolio",
    "Web Development",
  ],
  authors: [{ name: "Flexify" }],
  creator: "Flexify",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    siteName: "Flexify Portfolio",
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
