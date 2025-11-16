"use client";

import { useCurrentUserQuery, useLogoutMutation } from "@/modules/auth/auth-hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { Routes } from "@/constants/routes";
import Link from "next/link";

export default function Home() {
  const { data: user, isLoading } = useCurrentUserQuery();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to Flexify</CardTitle>
          <CardDescription>
            Your all-in-one project management solution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.lastName || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {(user.role === "admin" || user.role === "super_admin") && (
                  <Link href={Routes.dashboardProfile}>
                    <Button className="w-full" variant="default">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href={Routes.login}>
                <Button className="w-full" variant="default">
                  Login
                </Button>
              </Link>
              <Link href={Routes.register}>
                <Button className="w-full" variant="outline">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
