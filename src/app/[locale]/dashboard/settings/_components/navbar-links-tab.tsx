"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  useAllNavbarLinksQuery,
  useCreateNavbarLinkMutation,
  useUpdateNavbarLinkMutation,
  useDeleteNavbarLinkMutation,
} from "@/modules/site-settings/site-settings-hook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { INavbarLink } from "@/modules/site-settings/site-settings-type";

const navbarLinkSchema = z.object({
  href: z.string().min(1, "Href is required").startsWith("/", "Href must start with /"),
  icon: z.string().optional(),
  orderIndex: z.number().int().min(0),
  isActive: z.boolean(),
  translations: z.array(
    z.object({
      locale: z.string().min(1),
      label: z.string().min(1, "Label is required"),
    })
  ).min(1, "At least one translation is required"),
});

type NavbarLinkFormValues = z.infer<typeof navbarLinkSchema>;

export function NavbarLinksTab() {
  const t = useTranslations("dashboard.settings.navbarLinks");
  const locale = useLocale();
  const { data, isLoading, refetch } = useAllNavbarLinksQuery();
  const createMutation = useCreateNavbarLinkMutation();
  const updateMutation = useUpdateNavbarLinkMutation();
  const deleteMutation = useDeleteNavbarLinkMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<INavbarLink | null>(null);

  const links = data?.data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NavbarLinkFormValues>({
    resolver: zodResolver(navbarLinkSchema),
    defaultValues: {
      href: "",
      icon: "",
      orderIndex: links.length,
      isActive: true,
      translations: [
        { locale: "en", label: "" },
        { locale: "ar", label: "" },
      ],
    },
  });

  const watchedTranslations = watch("translations");

  const handleCreate = () => {
    reset({
      href: "",
      icon: "",
      orderIndex: links.length,
      isActive: true,
      translations: [
        { locale: "en", label: "" },
        { locale: "ar", label: "" },
      ],
    });
    setIsCreateOpen(true);
  };

  const handleEdit = (link: INavbarLink) => {
    setSelectedLink(link);
    reset({
      href: link.href,
      icon: link.icon || "",
      orderIndex: link.orderIndex,
      isActive: link.isActive,
      translations: [
        {
          locale: "en",
          label: link.translations?.find((t) => t.locale === "en")?.label || "",
        },
        {
          locale: "ar",
          label: link.translations?.find((t) => t.locale === "ar")?.label || "",
        },
      ],
    });
    setIsEditOpen(true);
  };

  const handleDelete = (link: INavbarLink) => {
    setSelectedLink(link);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: NavbarLinkFormValues) => {
    try {
      if (selectedLink) {
        await updateMutation.mutateAsync({
          id: selectedLink.id,
          data: values,
        });
        setIsEditOpen(false);
        setSelectedLink(null);
        toast.success(t("updateSuccess"));
      } else {
        await createMutation.mutateAsync(values);
        setIsCreateOpen(false);
        toast.success(t("createSuccess"));
      }
      reset();
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onDelete = async () => {
    if (!selectedLink) return;
    try {
      await deleteMutation.mutateAsync(selectedLink.id);
      setIsDeleteOpen(false);
      setSelectedLink(null);
      toast.success(t("deleteSuccess"));
      refetch();
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
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("createButton")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t("createTitle")}</DialogTitle>
                  <DialogDescription>{t("createDescription")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="href">{t("hrefLabel")}</Label>
                    <Input
                      id="href"
                      {...register("href")}
                      placeholder="/projects"
                      disabled={createMutation.isPending}
                    />
                    {errors.href && (
                      <p className="text-sm text-destructive">{errors.href.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">{t("iconLabel")}</Label>
                    <Input
                      id="icon"
                      {...register("icon")}
                      placeholder="IconHome"
                      disabled={createMutation.isPending}
                    />
                    <p className="text-xs text-muted-foreground">{t("iconHint")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderIndex">{t("orderIndexLabel")}</Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      {...register("orderIndex", { valueAsNumber: true })}
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={watch("isActive")}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                      disabled={createMutation.isPending}
                    />
                    <Label htmlFor="isActive">{t("isActiveLabel")}</Label>
                  </div>

                  <div className="space-y-4">
                    <Label>{t("translationsLabel")}</Label>
                    {["en", "ar"].map((loc) => (
                      <div key={loc} className="space-y-2">
                        <Label htmlFor={`translation-${loc}`}>
                          {loc.toUpperCase()} {t("labelLabel")}
                        </Label>
                        <Input
                          id={`translation-${loc}`}
                          {...register(`translations.${loc === "en" ? 0 : 1}.label`)}
                          placeholder={t("labelPlaceholder")}
                          disabled={createMutation.isPending}
                        />
                        <input
                          type="hidden"
                          {...register(`translations.${loc === "en" ? 0 : 1}.locale`)}
                          value={loc}
                        />
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      disabled={createMutation.isPending}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? t("creating") : t("create")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {links.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("noLinks")}
              </p>
            ) : (
              links
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((link) => {
                  const enLabel = link.translations?.find((t) => t.locale === "en")?.label;
                  const arLabel = link.translations?.find((t) => t.locale === "ar")?.label;
                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{link.href}</p>
                            {link.icon && (
                              <Badge variant="outline">{link.icon}</Badge>
                            )}
                            {!link.isActive && (
                              <Badge variant="secondary">{t("inactive")}</Badge>
                            )}
                          </div>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <span>EN: {enLabel || "-"}</span>
                            <span>AR: {arLabel || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(link)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(link)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription>{t("editDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-href">{t("hrefLabel")}</Label>
              <Input
                id="edit-href"
                {...register("href")}
                disabled={updateMutation.isPending}
              />
              {errors.href && (
                <p className="text-sm text-destructive">{errors.href.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">{t("iconLabel")}</Label>
              <Input
                id="edit-icon"
                {...register("icon")}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-orderIndex">{t("orderIndexLabel")}</Label>
              <Input
                id="edit-orderIndex"
                type="number"
                {...register("orderIndex", { valueAsNumber: true })}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                disabled={updateMutation.isPending}
              />
              <Label htmlFor="edit-isActive">{t("isActiveLabel")}</Label>
            </div>

            <div className="space-y-4">
              <Label>{t("translationsLabel")}</Label>
              {["en", "ar"].map((loc) => (
                <div key={loc} className="space-y-2">
                  <Label htmlFor={`edit-translation-${loc}`}>
                    {loc.toUpperCase()} {t("labelLabel")}
                  </Label>
                  <Input
                    id={`edit-translation-${loc}`}
                    {...register(`translations.${loc === "en" ? 0 : 1}.label`)}
                    disabled={updateMutation.isPending}
                  />
                  <input
                    type="hidden"
                    {...register(`translations.${loc === "en" ? 0 : 1}.locale`)}
                    value={loc}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedLink(null);
                }}
                disabled={updateMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? t("updating") : t("update")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")} {selectedLink?.href}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

