"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useDeleteUserMutation } from "@/modules/users/users-hook";
import { IUser } from "@/modules/users/users-type";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteUserModal({
  user,
  children,
}: {
  user: IUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations("dashboard.users.deleteUser");
  const tCommon = useTranslations("common");

  const { mutate: deleteUser, isPending } = useDeleteUserMutation();

  const onSubmit = (id: string) => {
    deleteUser(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            loading={isPending}
            onClick={() => onSubmit(user.id)}
          >
            {tCommon("delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
