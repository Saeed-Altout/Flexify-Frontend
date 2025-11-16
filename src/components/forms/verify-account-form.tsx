"use client";

import { useTranslations } from "next-intl";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";

import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/modules/auth/auth-hook";

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
import { LinkButton } from "../buttons/link-button";
import { Routes } from "@/constants/routes";

interface VerifyAccountFormProps {
  verificationToken: string;
  email?: string;
}

export function VerifyAccountForm({
  verificationToken,
  email,
}: VerifyAccountFormProps) {
  const t = useTranslations("auth.verifyAccount");
  const tCommon = useTranslations("common");

  const formSchema = z.object({
    verificationToken: z.string(),
    otp: z.string().length(6, {
      message: t("otpValidation"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationToken,
      otp: "",
    },
  });

  const { mutate: verifyEmail, isPending } = useVerifyEmailMutation();
  const { mutate: resendOTP, isPending: isResending } =
    useResendVerificationMutation();

  const RESEND_TIMEOUT = 60;
  const [timer, setTimer] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isResendDisabled = isPending || isResending || timer > 0;

  const startTimer = () => {
    setTimer(RESEND_TIMEOUT);
  };

  useEffect(() => {
    if (timer === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timer > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current && timer === 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    verifyEmail(values);
  };

  const handleResendOTP = () => {
    if (!email) {
      toast.error(t("emailNotAvailable"));
      return;
    }
    resendOTP({ email });
    startTimer();
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
                        <InputOTPSlot index={0} className="lg:size-12" />
                        <InputOTPSlot index={1} className="lg:size-12" />
                        <InputOTPSlot index={2} className="lg:size-12" />
                        <InputOTPSlot index={3} className="lg:size-12" />
                        <InputOTPSlot index={4} className="lg:size-12" />
                        <InputOTPSlot index={5} className="lg:size-12" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="mx-auto" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              loading={isPending}
            >
              {tCommon("verifyAccount")}
            </Button>
          </CardContent>
          <CardFooter className="flex-col justify-center text-sm">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground">{tCommon("noCode")}</p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResendDisabled}
                className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed ps-1"
              >
                {isResending
                  ? tCommon("sendingCode")
                  : timer > 0
                  ? `${tCommon("resendCode")} (${timer})`
                  : tCommon("resendCode")}
              </button>
            </div>

            <LinkButton label={tCommon("login")} href={Routes.login} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
