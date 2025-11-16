"use client";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useSignUpMutation } from "@/modules/auth/auth-hook";
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
import { FirstNameInput } from "@/components/inputs/firstName-input";
import { LastNameInput } from "@/components/inputs/lastName-input";
import { PhoneInput } from "@/components/inputs/phone-input";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");

  const formSchema = z.object({
    email: z.email(t("emailValidation")),
    password: z.string().min(8, t("passwordValidation")),
    firstName: z.string().max(20, t("firstNameValidation")),
    lastName: z.string().max(20, t("lastNameValidation")),
    phone: z.string().min(10, t("phoneValidation")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const { mutate: signUp, isPending } = useSignUpMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signUp(values);
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
              {tCommon("signUp")}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground">{tCommon("haveAccount")}</p>
            <LinkButton
              label={tCommon("login")}
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
