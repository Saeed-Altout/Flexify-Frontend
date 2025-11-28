import type { Metadata } from "next";
import { Poppins, Cairo } from "next/font/google";
import "../globals.css";

import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { ReactQueryProviders } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/utils";
import { getDir } from "@/utils/get-dir";
import { generateSeoMetadata } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("portfolio.seo.default");

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    path: "/",
    locale,
    type: "website",
  });
}

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
                <SpeedInsights />
                <Analytics />
                <Toaster position="top-center" />
              </ThemeProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
