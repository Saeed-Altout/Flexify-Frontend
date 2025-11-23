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
  useUploadTestimonialAvatarMutation,
} from "@/modules/testimonials/testimonials-hook";
import { ITestimonial } from "@/modules/testimonials/testimonials-type";
import { AvatarUpload } from "./avatar-upload";

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
import { TranslationInputs } from "@/components/ui/translation-inputs";
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
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  orderIndex: z.number().int().min(0).optional(),
  // Translations (optional, added dynamically)
  contentEn: z.string().optional(),
  authorNameEn: z.string().optional(),
  authorPositionEn: z.string().optional(),
  companyEn: z.string().optional(),
  contentAr: z.string().optional(),
  authorNameAr: z.string().optional(),
  authorPositionAr: z.string().optional(),
  companyAr: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export function TestimonialForm({ testimonial, mode }: TestimonialFormProps) {
  const t = useTranslations("dashboard.testimonials.form");
  const router = useRouter();

  const createMutation = useCreateTestimonialMutation();
  const updateMutation = useUpdateTestimonialMutation();
  const uploadAvatarMutation = useUploadTestimonialAvatarMutation();

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    testimonial?.avatarUrl || null
  );

  // Get translations for initial state
  const existingTranslations = testimonial?.translations || [];
  const initialLocales = existingTranslations.map((t) => t.locale);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      rating: testimonial?.rating || undefined,
      isFeatured: testimonial?.isFeatured || false,
      isApproved: testimonial?.isApproved || false,
      orderIndex: testimonial?.orderIndex || 0,
      contentEn: existingTranslations.find((t) => t.locale === "en")?.content || "",
      authorNameEn: existingTranslations.find((t) => t.locale === "en")?.authorName || "",
      authorPositionEn: existingTranslations.find((t) => t.locale === "en")?.authorPosition || "",
      companyEn: existingTranslations.find((t) => t.locale === "en")?.company || "",
      contentAr: existingTranslations.find((t) => t.locale === "ar")?.content || "",
      authorNameAr: existingTranslations.find((t) => t.locale === "ar")?.authorName || "",
      authorPositionAr: existingTranslations.find((t) => t.locale === "ar")?.authorPosition || "",
      companyAr: existingTranslations.find((t) => t.locale === "ar")?.company || "",
    },
  });

  const handleAvatarFileSelect = (file: File) => {
    setSelectedAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setSelectedAvatarFile(null);
    setAvatarPreview(null);
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    // Build translations array from form values
    const translations: Array<{
      locale: string;
      content: string;
      authorName: string;
      authorPosition?: string;
      company?: string;
    }> = [];
    
    if (values.contentEn) {
      translations.push({
        locale: "en",
        content: values.contentEn,
        authorName: values.authorNameEn || "",
        authorPosition: values.authorPositionEn,
        company: values.companyEn,
      });
    }
    
    if (values.contentAr) {
      translations.push({
        locale: "ar",
        content: values.contentAr,
        authorName: values.authorNameAr || "",
        authorPosition: values.authorPositionAr,
        company: values.companyAr,
      });
    }

    const baseData = {
      rating: values.rating,
      isFeatured: values.isFeatured,
      isApproved: values.isApproved,
      orderIndex: values.orderIndex,
      translations,
    };

    if (mode === "create") {
      // Create testimonial first
      const result = await createMutation.mutateAsync(baseData);
      const testimonialId = result.data?.data?.id;

      // Upload avatar if file was selected
      if (selectedAvatarFile && testimonialId) {
        await uploadAvatarMutation.mutateAsync({
          testimonialId,
          file: selectedAvatarFile,
        });
      }

      router.push("/dashboard/testimonials");
    } else if (testimonial) {
      // Update testimonial first
      await updateMutation.mutateAsync({
        id: testimonial.id,
        data: baseData,
      });

      // Upload avatar if file was selected
      if (selectedAvatarFile) {
        await uploadAvatarMutation.mutateAsync({
          testimonialId: testimonial.id,
          file: selectedAvatarFile,
        });
      }

      router.push("/dashboard/testimonials");
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadAvatarMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div>
            <FormLabel className="mb-4 block">
              {t("avatarLabel") || "Avatar"}
            </FormLabel>
            <AvatarUpload
              currentAvatar={avatarPreview}
              onFileSelect={handleAvatarFileSelect}
              onRemove={handleAvatarRemove}
              isUploading={uploadAvatarMutation.isPending}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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

        <TranslationInputs
          initialLocales={initialLocales}
          isLoading={isLoading}
        >
          {(locale, localeKey) => (
            <>
              <FormField
                control={form.control}
                name={`content${localeKey}` as any}
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
                  name={`authorName${localeKey}` as any}
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
                  name={`authorPosition${localeKey}` as any}
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
                name={`company${localeKey}` as any}
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
            </>
          )}
        </TranslationInputs>

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
