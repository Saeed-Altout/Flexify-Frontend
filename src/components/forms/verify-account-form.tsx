"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { useValidationsSchema } from "@/hooks/use-validations-schema";
import {
  useVerifyAccountMutation,
  useSendVerificationCodeMutation,
} from "@/hooks/use-auth-mutations";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerifyAccountFormProps {
  email: string;
}

export function VerifyAccountForm({ email }: VerifyAccountFormProps) {
  const t = useTranslations("auth.verifyAccount");
  const { verifyAccountSchema } = useValidationsSchema();
  const formSchema = verifyAccountSchema();

  const { mutate: verifyAccount, isPending: isVerifyAccountPending } =
    useVerifyAccountMutation();
  const { mutate: sendVerificationCode, isPending: isSendingVerificationCode } =
    useSendVerificationCodeMutation();

  const isPending = isVerifyAccountPending || isSendingVerificationCode;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    verifyAccount({
      email,
      code: values.otp,
    });
  };

  const handleResendCode = () => {
    sendVerificationCode({ email });
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
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                      disabled={isPending}
                    >
                      <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
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
            <p className="text-muted-foreground">{t("noCode")}</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isPending}
              className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed ps-1"
            >
              {isPending ? t("sendingCode") : t("resendCode")}
            </button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
