"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";

import { useUserQuery } from "@/modules/users/users-hook";
import { Routes } from "@/constants/routes";

import { Heading } from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";

export function UserDetailPageClient({ userId }: { userId: string }) {
  const t = useTranslations("dashboard.users.detail");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: userResponse, error, isLoading } = useUserQuery(userId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !userResponse?.data?.data) {
    return <ErrorState />;
  }

  const user = userResponse.data.data;

  const handleBack = () => {
    router.push(Routes.dashboardUsers);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Heading title={t("title")} description={t("description")}>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="size-4" />
          {tCommon("backToPrevious")}
        </Button>
      </Heading>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <UserIcon className="size-5" />
              <span>{t("sections.personalInfo")}</span>
            </CardTitle>
            <CardDescription>
              {t("sections.personalInfoDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.avatarUrl || undefined}
                  alt={user?.email}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.charAt(0) ||
                    user?.lastName?.charAt(0) ||
                    user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {user?.firstName && user?.lastName
                    ? `${user?.firstName} ${user?.lastName}`
                    : user?.firstName || user?.lastName || "User"}
                </h3>
                <Badge
                  variant={
                    user.role === "admin" || user.role === "super_admin"
                      ? "default"
                      : "secondary"
                  }
                  className="mt-1"
                >
                  {tCommon(`roles.${user.role}`)}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {user.firstName && (
                <Item>
                  <ItemMedia>
                    <UserIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{tCommon("columns.firstName")}</ItemTitle>
                    <ItemDescription>{user.firstName}</ItemDescription>
                  </ItemContent>
                </Item>
              )}

              {user.lastName && (
                <Item>
                  <ItemMedia>
                    <UserIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{tCommon("columns.lastName")}</ItemTitle>
                    <ItemDescription>{user.lastName}</ItemDescription>
                  </ItemContent>
                </Item>
              )}

              {user.email && (
                <Item>
                  <ItemMedia>
                    <MailIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{tCommon("email")}</ItemTitle>
                    <ItemDescription>{user.email}</ItemDescription>
                  </ItemContent>
                </Item>
              )}

              {user.phone && (
                <Item>
                  <ItemMedia>
                    <PhoneIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{tCommon("phone")}</ItemTitle>
                    <ItemDescription>{user.phone}</ItemDescription>
                  </ItemContent>
                </Item>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <ShieldIcon className="size-5" />
              <span>{t("sections.accountInfo")}</span>
            </CardTitle>
            <CardDescription>
              {t("sections.accountInfoDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item>
              <ItemMedia>
                <ShieldIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{tCommon("accountStatus")}</ItemTitle>
                <ItemDescription className="flex items-center gap-2">
                  <Badge
                    variant={user?.isEmailVerified ? "default" : "secondary"}
                  >
                    {user?.isEmailVerified
                      ? tCommon("verified")
                      : tCommon("unverified")}
                  </Badge>
                  <Badge variant={user?.isActive ? "default" : "destructive"}>
                    {user?.isActive ? tCommon("active") : tCommon("inactive")}
                  </Badge>
                </ItemDescription>
              </ItemContent>
            </Item>

            <Item>
              <ItemMedia>
                <UserIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{tCommon("columns.role")}</ItemTitle>
                <ItemDescription>
                  <Badge
                    variant={
                      user.role === "admin" || user.role === "super_admin"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {tCommon(`roles.${user.role}`)}
                  </Badge>
                </ItemDescription>
              </ItemContent>
            </Item>

            {user.lastLoginAt && (
              <Item>
                <ItemMedia>
                  <ClockIcon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t("lastLogin")}</ItemTitle>
                  <ItemDescription>
                    {format(new Date(user.lastLoginAt), "PPpp")}
                  </ItemDescription>
                </ItemContent>
              </Item>
            )}

            <Item>
              <ItemMedia>
                <CalendarIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{t("createdAt")}</ItemTitle>
                <ItemDescription>
                  {format(new Date(user.createdAt), "PPpp")}
                </ItemDescription>
              </ItemContent>
            </Item>

            <Item>
              <ItemMedia>
                <CalendarIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{t("updatedAt")}</ItemTitle>
                <ItemDescription>
                  {format(new Date(user.updatedAt), "PPpp")}
                </ItemDescription>
              </ItemContent>
            </Item>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
