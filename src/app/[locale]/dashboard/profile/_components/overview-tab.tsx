"use client";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Shield, UserIcon } from "lucide-react";
import { IUser } from "@/modules/auth/auth-type";

export function OverviewTab({ user }: { user: IUser }) {
  const t = useTranslations("dashboard.profile");

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
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl || undefined} alt={user?.email} />
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
              {user.role === "admin" ? "Admin" : "User"}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          {user?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={user?.isEmailVerified ? "default" : "secondary"}
                >
                  {user?.isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
