"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFolder,
  IconUsers,
  IconHelp,
  IconMail,
  IconStar,
  IconSettings,
  IconCode,
  IconTags,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { getSide } from "@/utils/get-side";
import { Logo } from "./common/logo";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const t = useTranslations("sidebar");
  const { data: userData } = useCurrentUserQuery();
  const user = userData?.data?.data;

  const userInfo = user
    ? {
        name: `${user.firstName} ${user.lastName}`.trim() || user.email,
        email: user.email,
        avatar: user.avatarUrl || "",
      }
    : {
        name: "User",
        email: "",
        avatar: "",
      };

  const navMain = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: t("users"),
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: t("projects"),
      url: "/dashboard/projects",
      icon: IconFolder,
    },
    {
      title: t("inquiryTypes"),
      url: "/dashboard/inquiry-types",
      icon: IconHelp,
    },
    {
      title: t("contacts"),
      url: "/dashboard/contacts",
      icon: IconMail,
    },
    {
      title: t("testimonials"),
      url: "/dashboard/testimonials",
      icon: IconStar,
    },
    {
      title: t("services"),
      url: "/dashboard/services",
      icon: IconSettings,
    },
    {
      title: t("technologies"),
      url: "/dashboard/technologies",
      icon: IconCode,
    },
    {
      title: t("categories"),
      url: "/dashboard/categories",
      icon: IconTags,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props} side={getSide(locale)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
