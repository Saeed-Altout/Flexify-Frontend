"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconMail, IconPhone, IconMapPin, IconSend } from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInquiryTypesQuery } from "@/modules/inquiry-types/inquiry-types-hook";
import { useCreateContactMutation } from "@/modules/contacts/contacts-hook";
import { toast } from "sonner";
import { getIconComponent } from "@/utils/icon-utils";

const contactInfo = [
  {
    id: "email",
    icon: IconMail,
  },
  {
    id: "phone",
    icon: IconPhone,
  },
  {
    id: "location",
    icon: IconMapPin,
  },
];

export function ContactSection() {
  const t = useTranslations("portfolio.contact");
  const locale = useLocale();
  const createContactMutation = useCreateContactMutation();
  const { data: inquiryTypesData } = useInquiryTypesQuery({
    isActive: true,
    locale,
  });

  const inquiryTypes = inquiryTypesData?.data?.data || [];

  const formSchema = z.object({
    name: z.string().min(2, t("form.name.validation")),
    email: z.string().email(t("form.email.validation")),
    phone: z.string().optional(),
    inquiryTypeId: z.string().optional(),
    subject: z.string().min(3, t("form.subject.validation")),
    message: z.string().min(10, t("form.message.validation")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryTypeId: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createContactMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        inquiryTypeId: values.inquiryTypeId,
        subject: values.subject,
        message: values.message,
      });
      form.reset();
      toast.success(t("form.success"));
    } catch (error) {
      toast.error(t("form.error"));
    }
  };

  const getContactLabel = (id: string): string => {
    const key = `info.${id}.label` as
      | "info.email.label"
      | "info.phone.label"
      | "info.location.label";
    return t(key);
  };

  const getContactValue = (id: string): string => {
    const key = `info.${id}.value` as
      | "info.email.value"
      | "info.phone.value"
      | "info.location.value";
    return t(key);
  };

  return (
    <section className="py-16 px-4">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 text-foreground">
                            {getContactLabel(info.id)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getContactValue(info.id)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.name.label")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("form.name.placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.email.label")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t("form.email.placeholder")}
                                {...field}
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
                            <FormLabel>{t("form.phone.label")}</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder={t("form.phone.placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {inquiryTypes.length > 0 && (
                      <FormField
                        control={form.control}
                        name="inquiryTypeId"
                        render={({ field }) => {
                          const selectedType = inquiryTypes.find(
                            (type) => type.id === field.value
                          );
                          const translation = selectedType?.translations?.find(
                            (t) => t.locale === locale
                          );
                          const fallbackTranslation =
                            selectedType?.translations?.[0];
                          const selectedName =
                            translation?.name ||
                            fallbackTranslation?.name ||
                            "";

                          return (
                            <FormItem>
                              <FormLabel>{t("form.inquiryType.label")}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    {selectedType && (() => {
                                      const SelectedIcon = getIconComponent(selectedType.icon);
                                      return (
                                        <>
                                          {SelectedIcon && (
                                            <SelectedIcon className="h-4 w-4" />
                                          )}
                                          <SelectValue placeholder={t("form.inquiryType.placeholder")} />
                                        </>
                                      );
                                    })()}
                                    {!selectedType && (
                                      <SelectValue placeholder={t("form.inquiryType.placeholder")} />
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {inquiryTypes.map((type) => {
                                    const typeTranslation =
                                      type.translations?.find(
                                        (t) => t.locale === locale
                                      );
                                    const typeFallback =
                                      type.translations?.[0];
                                    const typeName =
                                      typeTranslation?.name ||
                                      typeFallback?.name ||
                                      type.slug;
                                    const IconComponent = getIconComponent(type.icon);

                                    return (
                                      <SelectItem key={type.id} value={type.id}>
                                        <div className="flex items-center gap-2">
                                          {IconComponent && (
                                            <IconComponent className="h-4 w-4" />
                                          )}
                                          <span>{typeName}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.subject.label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.subject.placeholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.message.label")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("form.message.placeholder")}
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={createContactMutation.isPending}
                      className="w-full rounded-lg"
                    >
                      {createContactMutation.isPending ? (
                        t("form.submitting")
                      ) : (
                        <>
                          {t("form.submit")}
                          <IconSend className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
