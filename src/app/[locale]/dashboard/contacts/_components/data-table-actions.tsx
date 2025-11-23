"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { IContact } from "@/modules/contacts/contacts-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteContactModal } from "./delete-contact-modal";
import { ContactReplyModal } from "../[id]/_components/contact-reply-modal";

interface DataTableActionsProps {
  contact: IContact;
}

export function DataTableActions({ contact }: DataTableActionsProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.contacts.actions");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

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
            onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {t("view")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/contacts/${contact.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowReplyModal(true)}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("reply")}
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

      <DeleteContactModal
        contact={contact}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />
      <ContactReplyModal
        contact={contact}
        open={showReplyModal}
        onOpenChange={setShowReplyModal}
      />
    </>
  );
}

