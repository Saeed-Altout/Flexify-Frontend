"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSiteSettingQuery, useUpdateSiteSettingMutation } from "@/modules/site-settings/site-settings-hook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { IGithubSettings } from "@/modules/site-settings/site-settings-type";

const githubSchema = z.object({
  repoUrl: z.string().url("Invalid URL"),
  followers: z.number().int().min(0, "Followers must be a positive number"),
});

type GitHubFormValues = z.infer<typeof githubSchema>;

export function GitHubTab() {
  const t = useTranslations("dashboard.settings.github");
  const { data, isLoading } = useSiteSettingQuery("github");
  const updateMutation = useUpdateSiteSettingMutation();

  const githubSetting = data?.data?.data;
  const githubValue = githubSetting?.value as IGithubSettings | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GitHubFormValues>({
    resolver: zodResolver(githubSchema),
    defaultValues: {
      repoUrl: githubValue?.repoUrl || "",
      followers: githubValue?.followers || 0,
    },
    values: githubValue ? {
      repoUrl: githubValue.repoUrl,
      followers: githubValue.followers,
    } : undefined,
  });

  const onSubmit = async (values: GitHubFormValues) => {
    try {
      await updateMutation.mutateAsync({
        key: "github",
        data: {
          value: {
            repoUrl: values.repoUrl,
            followers: values.followers,
          },
        },
      });
      toast.success(t("updateSuccess"));
    } catch (error) {
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
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repoUrl">{t("repoUrlLabel")}</Label>
            <Input
              id="repoUrl"
              {...register("repoUrl")}
              placeholder="https://github.com/username"
              disabled={updateMutation.isPending}
            />
            {errors.repoUrl && (
              <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="followers">{t("followersLabel")}</Label>
            <Input
              id="followers"
              type="number"
              {...register("followers", { valueAsNumber: true })}
              placeholder="0"
              disabled={updateMutation.isPending}
            />
            {errors.followers && (
              <p className="text-sm text-destructive">{errors.followers.message}</p>
            )}
            <p className="text-xs text-muted-foreground">{t("followersHint")}</p>
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t("saving") : t("saveButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

