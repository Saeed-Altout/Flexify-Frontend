"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContactsQuery } from "@/modules/contacts/contacts-hook";
import { Link } from "@/i18n/navigation";
import { useMemo } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  
  // Get contacts that need reply (status: new)
  const { data: contactsData } = useContactsQuery({
    status: "new",
    limit: 1,
  });

  const pendingContactsCount = useMemo(() => {
    // The API returns { data: { data: IContact[], meta: { total, page, limit } } }
    return contactsData?.data?.meta?.total ?? 0;
  }, [contactsData]);

  // Generate breadcrumb from pathname
  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: Array<{ label: string; href?: string }> = [];

    // Always start with Dashboard
    items.push({
      label: t("dashboard"),
      href: "/dashboard",
    });

    // Build breadcrumb from segments
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Skip dashboard segment as we already added it
      if (segment === "dashboard") return;

      // Translate segment to readable label
      let label = segment;
      if (segment === "users") label = t("users");
      else if (segment === "projects") label = t("projects");
      else if (segment === "inquiry-types") label = t("inquiryTypes");
      else if (segment === "contacts") label = t("contacts");
      else if (segment === "testimonials") label = t("testimonials");
      else if (segment === "services") label = t("services");
      else if (segment === "account") label = t("account") || "Account";
      else if (segment === "create") label = t("create") || "Create";
      else if (segment === "edit") label = t("edit") || "Edit";
      else {
        // Capitalize and format
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [pathname, t]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link href="/dashboard/contacts?status=new">
              <Bell className="h-5 w-5" />
              {pendingContactsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {pendingContactsCount > 99 ? "99+" : pendingContactsCount}
                </Badge>
              )}
              <span className="sr-only">
                {pendingContactsCount > 0
                  ? `${pendingContactsCount} contacts need reply`
                  : "Notifications"}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
