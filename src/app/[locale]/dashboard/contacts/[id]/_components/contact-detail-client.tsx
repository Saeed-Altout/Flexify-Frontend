"use client";

import { useState } from "react";
import { useContactQuery } from "@/modules/contacts/contacts-hook";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft, Mail } from "lucide-react";
import { format } from "date-fns";
import { ContactReplyModal } from "./contact-reply-modal";

interface ContactDetailClientProps {
  id: string;
}

export function ContactDetailClient({ id }: ContactDetailClientProps) {
  const t = useTranslations("dashboard.contacts.detail");
  const tReply = useTranslations("dashboard.contacts.reply");
  const router = useRouter();
  const { data, isLoading } = useContactQuery(id);
  const [showReplyModal, setShowReplyModal] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const contact = data?.data?.data;
  if (!contact) {
    return <div>Contact not found</div>;
  }

  const statusVariants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    new: "default",
    read: "secondary",
    replied: "outline",
    archived: "destructive",
  };

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/contacts")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Heading title={contact.name} description={contact.email} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReplyModal(true)}
          >
            <Mail className="mr-2 h-4 w-4" />
            {tReply("button")}
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/contacts/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("email")}
            </h3>
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("phone")}
              </h3>
              <a
                href={`tel:${contact.phone}`}
                className="text-blue-600 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          )}
          {contact.subject && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("subject")}
              </h3>
              <p className="font-medium">{contact.subject}</p>
            </div>
          )}
          {contact.inquiryType && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("inquiryType")}
              </h3>
              <Badge variant="outline">
                {contact.inquiryType.translations?.[0]?.name || contact.inquiryType.slug}
              </Badge>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("statusLabel")}
            </h3>
            <Badge variant={statusVariants[contact.status] || "default"}>
              {t(`status.${contact.status}`)}
            </Badge>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("createdAt")}
            </h3>
            <p>{format(new Date(contact.createdAt), "PPpp")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("updatedAt")}
            </h3>
            <p>{format(new Date(contact.updatedAt), "PPpp")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("message")}</h3>
        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>

      <ContactReplyModal
        contact={contact}
        open={showReplyModal}
        onOpenChange={setShowReplyModal}
      />
    </div>
  );
}

