"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

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

import { useValidationsSchema } from "@/hooks/use-validations-schema";
import { Routes } from "@/constants/routes";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const { loginSchema } = useValidationsSchema();

  const formSchema = loginSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
              />
            </div>
            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground">{t("noAccount")}</p>
            <LinkButton
              label={t("signUp")}
              href={Routes.register}
              className="ps-1"
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
