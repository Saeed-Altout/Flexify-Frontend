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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const t = useTranslations("sidebar");

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
      items: [
        {
          title: t("allProjects"),
          url: "/dashboard/projects",
        },
        {
          title: t("createProject"),
          url: "/dashboard/projects/create",
        },
      ],
    },
    {
      title: t("inquiryTypes"),
      url: "/dashboard/inquiry-types",
      icon: IconHelp,
      items: [
        {
          title: t("allInquiryTypes"),
          url: "/dashboard/inquiry-types",
        },
        {
          title: t("createInquiryType"),
          url: "/dashboard/inquiry-types/create",
        },
      ],
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
      items: [
        {
          title: t("allTestimonials"),
          url: "/dashboard/testimonials",
        },
        {
          title: t("createTestimonial"),
          url: "/dashboard/testimonials/create",
        },
      ],
    },
    {
      title: t("services"),
      url: "/dashboard/services",
      icon: IconSettings,
      items: [
        {
          title: t("allServices"),
          url: "/dashboard/services",
        },
        {
          title: t("createService"),
          url: "/dashboard/services/create",
        },
      ],
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
