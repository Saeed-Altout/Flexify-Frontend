"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { GithubButton } from "@/components/buttons/github-button";
import { ModeToggleButton } from "@/components/buttons/mode-toggle-button";
import { Separator } from "@/components/ui/separator";
import { CVButton } from "@/components/buttons/cv-button";
import { MenuButton } from "@/components/buttons/menu-button";
import { cn } from "@/lib/utils";
import { useSiteSettingQuery } from "@/modules/site-settings/site-settings-hook";
import { getIconComponent } from "@/utils/dynamic-icon-loader";
import { NAVBAR_LINKS } from "@/constants/site.constants";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("portfolio.navbar");

  const { data: githubData, isLoading: githubLoading } =
    useSiteSettingQuery("github");
  const { data: cvData, isLoading: cvLoading } = useSiteSettingQuery("cv");

  const githubSettings = githubData?.data?.data?.value as
    | { repoUrl: string; followers: number }
    | undefined;
  const cvSettings = cvData?.data?.data?.value as
    | { url: string; fileName: string }
    | undefined;
  const cvTranslation = cvData?.data?.data?.translations?.find(
    (t: { locale: string }) => t.locale === locale
  )?.value as { label: string } | undefined;

  const navItems = NAVBAR_LINKS.map((link) => {
    const IconComponent = link.icon ? getIconComponent(link.icon) : null;
    return {
      href: link.href,
      label: tNav(link.translationKey),
      icon: IconComponent,
    };
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    // Check if pathname starts with href, but ensure it's a full path segment
    // e.g., "/projects" should match "/projects" and "/projects/[slug]" but not "/project"
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo className="me-2" />
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive(item.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {cvLoading ? (
            <Skeleton className="h-9 w-24 hidden sm:block" />
          ) : cvSettings && cvTranslation ? (
            <CVButton
              className="hidden sm:flex"
              cvUrl={cvSettings.url}
              fileName={cvSettings.fileName}
              label={cvTranslation.label}
            />
          ) : null}
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
          {githubLoading ? (
            <Skeleton className="h-9 w-20 hidden lg:block" />
          ) : githubSettings ? (
            <GithubButton
              followers={githubSettings.followers}
              repoUrl={githubSettings.repoUrl}
              className="hidden lg:flex"
            />
          ) : null}
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
          <ModeToggleButton className="hidden lg:flex" />

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <MenuButton />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{tNav("navigation")}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    if (!IconComponent) return null;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-2">
                    {cvSettings && cvTranslation ? (
                      <CVButton
                        className="w-full justify-start"
                        cvUrl={cvSettings.url}
                        fileName={cvSettings.fileName}
                        label={cvTranslation.label}
                      />
                    ) : null}
                    {githubSettings ? (
                      <GithubButton
                        followers={githubSettings.followers}
                        repoUrl={githubSettings.repoUrl}
                        className="w-full justify-start"
                      />
                    ) : null}
                    <ModeToggleButton className="w-full justify-start" />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
