"use client";

import { useTranslations } from "next-intl";

import { OverviewTab } from "./overview-tab";
import { EditProfileTab } from "./edit-profile-tab";
import { ChangePasswordTab } from "./change-password-tab";

import { useCurrentUserQuery } from "@/modules/auth/auth-hook";

import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";

export function ProfilePageClient() {
  const t = useTranslations("dashboard.profile");
  const { data: user, error, isLoading } = useCurrentUserQuery();

  if (isLoading || !user) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <Heading title={t("title")} description={t("description")} />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview.title")}</TabsTrigger>
          <TabsTrigger value="edit">{t("tabs.editProfile.title")}</TabsTrigger>
          <TabsTrigger value="password">
            {t("tabs.changePassword.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab user={user.data.data} />
        </TabsContent>

        <TabsContent value="edit">
          <EditProfileTab user={user.data.data} />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
