"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/common/logo";
import { Separator } from "@/components/ui/separator";
import { useSiteSettingQuery } from "@/modules/site-settings/site-settings-hook";
import { getLucideIcon } from "@/constants/lucide-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBrandWhatsapp, IconBrandTelegram } from "@tabler/icons-react";
import type {
  IFooterSettings,
  IFooterTranslation,
} from "@/modules/site-settings/site-settings-type";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("portfolio.contact");
  const { data: settingsData, isLoading: settingsLoading } =
    useSiteSettingQuery("footer");
  const { data: translationData, isLoading: translationLoading } =
    useSiteSettingQuery("footer", locale);

  // Contact URLs
  const whatsappUrl = `https://wa.me/963940043810`;
  const telegramUrl = `https://t.me/saeedaltoutdev`;

  const footerSettings = settingsData?.data?.data;
  const footerValue = footerSettings?.value as IFooterSettings | undefined;
  const footerTranslation = translationData?.data?.data?.translations?.[0]
    ?.value as IFooterTranslation | undefined;

  const currentYear = new Date().getFullYear();

  // Use fallback values if translation is missing
  const translation = footerTranslation || {
    description: "",
    contact: { title: "" },
    columns: {},
    copyright: "",
    rights: "",
  };

  const socialLinks = (footerValue?.socialLinks || [])
    .map((link) => {
      const IconComponent = getLucideIcon(link.icon);
      return {
        ...link,
        icon: IconComponent,
        label: link.icon, // Use icon name as label
      };
    })
    .filter((link) => link.icon !== null);

  const columns = (footerValue?.columns || []).map((column) => {
    const columnTranslation = translation.columns?.[column.key];
    return {
      title: columnTranslation?.title || column.key,
      links: column.links.map((link) => ({
        href: link.href,
        label: columnTranslation?.links?.[link.key] || link.key,
      })),
    };
  });

  if (settingsLoading || translationLoading) {
    return (
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  // Show footer even if data is missing (with fallbacks)
  if (!footerValue) {
    return null; // Only hide if settings don't exist at all
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo className="text-lg" />
            {translation.description && (
              <p className="text-sm text-muted-foreground">
                {translation.description}
              </p>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                if (!social.icon) return null;
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
              {/* WhatsApp and Telegram Icons */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={t("quickAccess.whatsapp")}
                title={t("quickAccess.whatsapp")}
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={t("quickAccess.telegram")}
                title={t("quickAccess.telegram")}
              >
                <IconBrandTelegram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns.map((column, index) => (
            <div key={index}>
              {column.title && (
                <h3 className="font-semibold mb-4 text-foreground">
                  {column.title}
                </h3>
              )}
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          {footerValue.contact && (
            <div>
              {translation.contact?.title && (
                <h3 className="font-semibold mb-4 text-foreground">
                  {translation.contact.title}
                </h3>
              )}
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                {footerValue.contact.email && (
                  <li>
                    <a
                      href={`mailto:${footerValue.contact.email}`}
                      className="hover:text-foreground transition-colors break-all"
                    >
                      {footerValue.contact.email}
                    </a>
                  </li>
                )}
                {footerValue.contact.phone && (
                  <li>
                    <a
                      href={`tel:${footerValue.contact.phone.replace(/\s/g, "")}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {footerValue.contact.phone}
                    </a>
                  </li>
                )}
                {footerValue.contact.location && (
                  <li>{footerValue.contact.location}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {translation.copyright && (
            <p>
              © {currentYear} {translation.copyright}
            </p>
          )}
          {translation.rights && <p>{translation.rights}</p>}
        </div>
      </div>
    </footer>
  );
}
