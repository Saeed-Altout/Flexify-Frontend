"use client";

import { useTranslations } from "next-intl";
import { useCurrentUserQuery } from "@/modules/auth/auth-hook";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageClient() {
  const t = useTranslations("dashboard.profile");
  const { data: userData, isLoading } = useCurrentUserQuery();
  const user = userData?.data?.data;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:space-y-6 md:p-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4 p-4 md:space-y-6 md:p-6">
        <Heading title="Account" description="User not found" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading 
        title={t("title") || "Account"} 
        description={t("description") || "View your account information"} 
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("title") || "Account Information"}</CardTitle>
          <CardDescription>
            {t("description") || "Your personal account details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* User Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("firstNameLabel") || "First Name"}
              </label>
              <p className="mt-1 text-sm font-medium">{user.firstName || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("lastNameLabel") || "Last Name"}
              </label>
              <p className="mt-1 text-sm font-medium">{user.lastName || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("emailLabel") || "Email"}
              </label>
              <p className="mt-1 text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("phoneLabel") || "Phone"}
              </label>
              <p className="mt-1 text-sm font-medium">{user.phone || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("accountStatus") || "Account Status"}
              </label>
              <p className="mt-1 text-sm font-medium">
                {user.isVerified ? t("verified") || "Verified" : t("unverified") || "Unverified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Role
              </label>
              <p className="mt-1 text-sm font-medium capitalize">{user.role || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

