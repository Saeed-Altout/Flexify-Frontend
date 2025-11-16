"use client";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useSignInMutation } from "@/modules/auth/auth-hook";
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
import { EmailInput } from "@/components/inputs/email-input";
import { LinkButton } from "@/components/buttons/link-button";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");

  const formSchema = z.object({
    email: z.email(t("emailValidation")),
    password: z.string().min(8, t("passwordValidation")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSignInMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signIn(values);
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
            <div className="space-y-1">
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
              <LinkButton
                label={t("forgetPassword")}
                href={Routes.forgetPassword}
                className="ps-0"
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              loading={isPending}
            >
              {tCommon("login")}
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
