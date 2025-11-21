import { useTranslations } from "next-intl";
import { EyeIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

import { IUser } from "@/modules/users/users-type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditUserModal } from "./edit-user-modal";
import { DeleteUserModal } from "./delete-user-modal";

export function DataTableActions({ user }: { user: IUser }) {
  const t = useTranslations("common");
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/users/${user.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t("openMenu")}</span>
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42" align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleView}>
          <EyeIcon />
          <span>{t("view")}</span>
        </DropdownMenuItem>
        <EditUserModal user={user}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PencilIcon />
            <span>{t("edit")}</span>
          </DropdownMenuItem>
        </EditUserModal>
        <DeleteUserModal user={user}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <TrashIcon />
            <span>{t("delete")}</span>
          </DropdownMenuItem>
        </DeleteUserModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
