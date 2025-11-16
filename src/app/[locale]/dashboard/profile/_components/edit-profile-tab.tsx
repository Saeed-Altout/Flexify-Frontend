"use client";

import { useTranslations } from "next-intl";
import { EditIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useUpdateProfileMutation } from "@/modules/users/users-hook";
import type { IUser } from "@/modules/auth/auth-type";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/inputs/email-input";
import { FirstNameInput } from "@/components/inputs/firstName-input";
import { LastNameInput } from "@/components/inputs/lastName-input";
import { PhoneInput } from "@/components/inputs/phone-input";
import { AvatarUpload } from "@/components/avatar-upload";

export function EditProfileTab({ user }: { user: IUser }) {
  const t = useTranslations("dashboard.profile");
  const tCommon = useTranslations("common");

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const formSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfile(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <EditIcon className="size-5" />
          <span>{t("tabs.editProfile.title")}</span>
        </CardTitle>
        <CardDescription>{t("tabs.editProfile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarUpload defaultAvatar={user?.avatarUrl || undefined} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstNameLabel")}</FormLabel>
                    <FormControl>
                      <FirstNameInput
                        {...field}
                        placeholder={t("firstNamePlaceholder")}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastNameLabel")}</FormLabel>
                    <FormControl>
                      <LastNameInput
                        {...field}
                        placeholder={t("lastNamePlaceholder")}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <EmailInput
                      {...field}
                      placeholder={t("emailPlaceholder")}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneLabel")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      placeholder={t("phonePlaceholder")}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} loading={isPending}>
              {tCommon("saveChanges")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
