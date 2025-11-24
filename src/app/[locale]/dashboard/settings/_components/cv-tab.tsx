"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useSiteSettingQuery,
  useUpdateSiteSettingMutation,
  useUploadCVMutation,
} from "@/modules/site-settings/site-settings-hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import type { ICVSettings } from "@/modules/site-settings/site-settings-type";

const cvSchema = z.object({
  url: z.string().url("Invalid URL"),
  fileName: z.string().min(1, "File name is required"),
});

type CVFormValues = z.infer<typeof cvSchema>;

export function CVTab() {
  const t = useTranslations("dashboard.settings.cv");
  const { data, isLoading } = useSiteSettingQuery("cv");
  const updateMutation = useUpdateSiteSettingMutation();
  const uploadMutation = useUploadCVMutation();

  const cvSetting = data?.data?.data;
  const cvValue = cvSetting?.value as ICVSettings | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CVFormValues>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      url: cvValue?.url || "",
      fileName: cvValue?.fileName || "",
    },
    values: cvValue
      ? {
          url: cvValue.url,
          fileName: cvValue.fileName,
        }
      : undefined,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error(t("errors.invalidFileType"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("errors.fileTooLarge"));
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      if (result.data) {
        setValue("url", result.data.url);
        setValue("fileName", result.data.fileName);
        toast.success(t("uploadSuccess"));
      }
    } catch {
      // Error handled by mutation
    }
  };

  const onSubmit = async (values: CVFormValues) => {
    try {
      await updateMutation.mutateAsync({
        key: "cv",
        data: {
          value: {
            url: values.url,
            fileName: values.fileName,
          },
        },
      });
      toast.success(t("updateSuccess"));
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-2">
          <Label>{t("uploadLabel")}</Label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={uploadMutation.isPending}
                className="cursor-pointer"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const fileInput = document.querySelector(
                  'input[type="file"]'
                ) as HTMLInputElement | null;
                fileInput?.click();
              }}
              disabled={uploadMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? t("uploading") : t("uploadButton")}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("uploadHint")}</p>
        </div>

        {/* Current CV Info */}
        {cvValue?.url && (
          <div className="flex items-center gap-2 rounded-lg border p-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{cvValue.fileName}</p>
              <a
                href={cvValue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                {cvValue.url}
              </a>
            </div>
          </div>
        )}

        {/* Manual URL Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">{t("urlLabel")}</Label>
            <Input
              id="url"
              {...register("url")}
              placeholder="https://example.com/cv.pdf"
              disabled={updateMutation.isPending}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">{t("fileNameLabel")}</Label>
            <Input
              id="fileName"
              {...register("fileName")}
              placeholder="My-CV.pdf"
              disabled={updateMutation.isPending}
            />
            {errors.fileName && (
              <p className="text-sm text-destructive">
                {errors.fileName.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t("saving") : t("saveButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
