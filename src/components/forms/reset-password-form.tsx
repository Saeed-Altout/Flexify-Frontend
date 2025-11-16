"use client";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useResetPasswordMutation } from "@/modules/auth/auth-hook";
import { Routes } from "@/constants/routes";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/inputs/password-input";
import { LinkButton } from "@/components/buttons/link-button";

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth.resetPassword");
  const tCommon = useTranslations("common");

  const formSchema = z.object({
    token: z.string().min(1, t("tokenValidation")),
    password: z.string().min(8, t("passwordValidation")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token,
      password: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    resetPassword(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder={t("passwordPlaceholder")}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              loading={isPending}
            >
              {tCommon("submit")}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground">{tCommon("noAccount")}</p>
            <LinkButton
              label={tCommon("signUp")}
              href={Routes.register}
              className="ps-1"
              disabled={isPending}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
