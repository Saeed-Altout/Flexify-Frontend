"use client";

import { useTranslations } from "next-intl";
import { MailIcon, PhoneIcon, ShieldIcon, UserIcon } from "lucide-react";

import { IUser } from "@/modules/users/users-type";

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

export function OverviewTab({ user }: { user: IUser }) {
  const t = useTranslations("dashboard.profile");
  const tCommon = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <UserIcon className="size-5" />
          <span>{t("tabs.overview.title")}</span>
        </CardTitle>
        <CardDescription>{t("tabs.overview.description")}</CardDescription>
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
              variant={user.role === "admin" ? "default" : "secondary"}
              className="mt-1"
            >
              {tCommon(`roles.${user.role}`)}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {user.email && (
            <Item>
              <ItemMedia>
                <MailIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{tCommon("email")}</ItemTitle>
                <ItemDescription>{user?.email}</ItemDescription>
              </ItemContent>
            </Item>
          )}

          {user?.phone && (
            <Item>
              <ItemMedia>
                <PhoneIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{tCommon("phone")}</ItemTitle>
                <ItemDescription>{user?.phone}</ItemDescription>
              </ItemContent>
            </Item>
          )}

          {(user?.isEmailVerified || user?.isActive) && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
