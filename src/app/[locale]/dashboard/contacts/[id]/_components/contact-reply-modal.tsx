"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { IContact } from "@/modules/contacts/contacts-type";
import { useReplyContactMutation } from "@/modules/contacts/contacts-hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";

interface ContactReplyModalProps {
  contact: IContact;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const replyFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ReplyFormValues = z.infer<typeof replyFormSchema>;

export function ContactReplyModal({
  contact,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ContactReplyModalProps) {
  const t = useTranslations("dashboard.contacts.reply");
  const [internalOpen, setInternalOpen] = useState(false);
  const replyMutation = useReplyContactMutation();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      subject: contact.subject ? `Re: ${contact.subject}` : "Re: Your Inquiry",
      message: "",
    },
  });

  const onSubmit = async (values: ReplyFormValues) => {
    try {
      await replyMutation.mutateAsync({
        contactId: contact.id,
        data: values,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const isLoading = replyMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {t("description", { name: contact.name, email: contact.email })}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subjectLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("subjectPlaceholder")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>{t("originalMessageLabel")}</FormLabel>
                <div className="rounded-lg border p-3 bg-muted/50 text-sm">
                  <p className="whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("messageLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("messagePlaceholder")}
                        disabled={isLoading}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("send")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}

