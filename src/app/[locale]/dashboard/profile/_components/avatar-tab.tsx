"use client";

import { useTranslations } from "next-intl";
import { CameraIcon, UploadIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/modules/users/users-hook";
import type { IUser } from "@/modules/auth/auth-type";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AvatarTab({ user }: { user: IUser }) {
  const t = useTranslations("dashboard.profile");
  const tCommon = useTranslations("common");

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatarMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CameraIcon className="size-5" />
          <span>{t("tabs.avatar.title")}</span>
        </CardTitle>
        <CardDescription>{t("tabs.avatar.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={user?.avatarUrl || undefined}
                alt={user?.email}
              />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.[0] + user?.lastName?.[0] || user?.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              {tCommon("chooseImage")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {tCommon("uploadMessage")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
