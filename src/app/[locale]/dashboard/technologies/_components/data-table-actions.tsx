"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { ITechnology } from "@/modules/technologies/technologies-type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteTechnologyModal } from "./delete-technology-modal";

interface DataTableActionsProps {
  technology: ITechnology;
}

export function DataTableActions({ technology }: DataTableActionsProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.technologies.actions");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/technologies/${technology.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {t("view")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/technologies/${technology.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteModal(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTechnologyModal
        technology={technology}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />
    </>
  );
}

