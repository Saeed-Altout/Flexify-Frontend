"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/modules/testimonials/testimonials-hook";
import { ITestimonial } from "@/modules/testimonials/testimonials-type";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  testimonial?: ITestimonial;
  mode: "create" | "edit";
}

const testimonialFormSchema = z.object({
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  orderIndex: z.number().int().min(0).optional(),
  // English Translation
  contentEn: z.string().min(1, "English content is required"),
  authorNameEn: z.string().min(1, "English author name is required"),
  authorPositionEn: z.string().optional(),
  companyEn: z.string().optional(),
  // Arabic Translation
  contentAr: z.string().min(1, "Arabic content is required"),
  authorNameAr: z.string().min(1, "Arabic author name is required"),
  authorPositionAr: z.string().optional(),
  companyAr: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export function TestimonialForm({ testimonial, mode }: TestimonialFormProps) {
  const t = useTranslations("dashboard.testimonials.form");
  const router = useRouter();

  const createMutation = useCreateTestimonialMutation();
  const updateMutation = useUpdateTestimonialMutation();

  // Get translations
  const enTranslation = testimonial?.translations?.find(
    (t) => t.locale === "en"
  );
  const arTranslation = testimonial?.translations?.find(
    (t) => t.locale === "ar"
  );

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      avatarUrl: testimonial?.avatarUrl || "",
      rating: testimonial?.rating || undefined,
      isFeatured: testimonial?.isFeatured || false,
      isApproved: testimonial?.isApproved || false,
      orderIndex: testimonial?.orderIndex || 0,
      contentEn: enTranslation?.content || "",
      authorNameEn: enTranslation?.authorName || "",
      authorPositionEn: enTranslation?.authorPosition || "",
      companyEn: enTranslation?.company || "",
      contentAr: arTranslation?.content || "",
      authorNameAr: arTranslation?.authorName || "",
      authorPositionAr: arTranslation?.authorPosition || "",
      companyAr: arTranslation?.company || "",
    },
  });

  const onSubmit = async (values: TestimonialFormValues) => {
    const baseData = {
      avatarUrl: values.avatarUrl || undefined,
      rating: values.rating,
      isFeatured: values.isFeatured,
      isApproved: values.isApproved,
      orderIndex: values.orderIndex,
      translations: [
        {
          locale: "en",
          content: values.contentEn,
          authorName: values.authorNameEn,
          authorPosition: values.authorPositionEn,
          company: values.companyEn,
        },
        {
          locale: "ar",
          content: values.contentAr,
          authorName: values.authorNameAr,
          authorPosition: values.authorPositionAr,
          company: values.companyAr,
        },
      ],
    };

    if (mode === "create") {
      await createMutation.mutateAsync(baseData);
      router.push("/dashboard/testimonials");
    } else if (testimonial) {
      await updateMutation.mutateAsync({
        id: testimonial.id,
        data: baseData,
      });
      router.push("/dashboard/testimonials");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("avatarUrlLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder={t("avatarUrlPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ratingLabel")}</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value) : undefined)
                  }
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder={t("ratingPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">{t("noRating")}</SelectItem>
                    <SelectItem value="1">1 ⭐</SelectItem>
                    <SelectItem value="2">2 ⭐⭐</SelectItem>
                    <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                    <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("orderIndexLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    placeholder={t("orderIndexPlaceholder")}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isFeaturedLabel")}</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isApproved"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isApprovedLabel")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue="en" className="w-full">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">Arabic</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-4">
            <FormField
              control={form.control}
              name="contentEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("contentPlaceholder")}
                      disabled={isLoading}
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="authorNameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("authorNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("authorNamePlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorPositionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("authorPositionLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("authorPositionPlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("companyLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("companyPlaceholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="ar" className="space-y-4">
            <FormField
              control={form.control}
              name="contentAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("contentPlaceholder")}
                      disabled={isLoading}
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="authorNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("authorNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("authorNamePlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorPositionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("authorPositionLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("authorPositionPlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("companyLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("companyPlaceholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
