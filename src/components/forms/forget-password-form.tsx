"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { useValidationsSchema } from "@/hooks/use-validations-schema";
import { useForgotPasswordMutation } from "@/hooks/use-auth-mutations";
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
import { EmailInput } from "@/components/inputs/email-input";
import { LinkButton } from "@/components/buttons/link-button";

export function ForgetPasswordForm() {
  const t = useTranslations("auth.forgetPassword");

  const { forgetPasswordSchema } = useValidationsSchema();
  const formSchema = forgetPasswordSchema();

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    forgotPassword(values);
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
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              loading={isPending}
            >
              {t("submit")}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground">{t("rememberPassword")}</p>
            <LinkButton
              label={t("signIn")}
              href={Routes.login}
              className="ps-1"
              disabled={isPending}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
