"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
import { GITHUB_FOLLOWERS, GITHUB_REPO_URL } from "@/constants/site.constants";
import { ModeToggleButton } from "@/components/buttons/mode-toggle-button";
import { Separator } from "@/components/ui/separator";
import { CVButton } from "@/components/buttons/cv-button";
import { MenuButton } from "@/components/buttons/menu-button";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconBriefcase,
  IconMail,
  IconCode,
} from "@tabler/icons-react";

export function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const tLinks = useTranslations("portfolio.footer.links");
  const tNav = useTranslations("portfolio.navbar");

  const navItems = [
    { href: "/", label: tLinks("home"), icon: IconHome },
    { href: "/projects", label: tLinks("projects"), icon: IconBriefcase },
    { href: "/services", label: tNav("services"), icon: IconCode },
    { href: "/contact", label: tLinks("contact"), icon: IconMail },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
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
          <CVButton className="hidden sm:flex" />
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
          <GithubButton
            followers={GITHUB_FOLLOWERS}
            repoUrl={GITHUB_REPO_URL}
            className="hidden lg:flex"
          />
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
                    <CVButton className="w-full justify-start" />
                    <GithubButton
                      followers={GITHUB_FOLLOWERS}
                      repoUrl={GITHUB_REPO_URL}
                      className="w-full justify-start"
                    />
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
