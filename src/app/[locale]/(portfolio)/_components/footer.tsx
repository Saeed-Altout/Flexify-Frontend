"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/common/logo";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons-react";
import { GITHUB_REPO_URL } from "@/constants/site.constants";

export function Footer() {
  const t = useTranslations("portfolio.footer");

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: t("links.home") },
    { href: "/about", label: t("links.about") },
    { href: "/projects", label: t("links.projects") },
    { href: "/contact", label: t("links.contact") },
  ];

  const resources = [
    { href: "/blog", label: t("resources.blog") },
    { href: "#", label: t("resources.other") },
  ];

  const socialLinks = [
    {
      icon: IconBrandGithub,
      href: GITHUB_REPO_URL,
      label: "GitHub",
    },
    {
      icon: IconBrandLinkedin,
      href: "#",
      label: "LinkedIn",
    },
    {
      icon: IconBrandTwitter,
      href: "#",
      label: "Twitter",
    },
    {
      icon: IconMail,
      href: "mailto:your.email@example.com",
      label: "Email",
    },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo className="text-lg" />
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
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
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
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

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">
              {t("resources.title")}
            </h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">
              {t("contact.title")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:your.email@example.com"
                  className="hover:text-foreground transition-colors"
                >
                  {t("contact.email")}
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="hover:text-foreground transition-colors"
                >
                  {t("contact.phone")}
                </a>
              </li>
              <li>{t("contact.location")}</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} {t("copyright")}
          </p>
          <p>{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}

