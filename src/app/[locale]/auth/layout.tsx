"use client";

import { useTranslations } from "next-intl";
import { ZapIcon } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("auth");

  return (
    <AuthGuard>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 p-6 md:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="relative hidden lg:block p-6">
          <div className="bg-background size-full flex justify-center items-center">
            <ZapIcon className="size-48" />
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
