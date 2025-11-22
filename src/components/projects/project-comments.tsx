"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useProjectCommentsQuery, useCreateCommentMutation } from "@/modules/projects/projects-hook";
import { useAuthStore } from "@/stores/use-auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconSend, IconMessage } from "@tabler/icons-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface ProjectCommentsProps {
  projectId: string;
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const t = useTranslations("portfolio.projectDetails.comments");
  const user = useAuthStore((state) => state.user);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useProjectCommentsQuery(projectId);
  const createComment = useCreateCommentMutation();

  const comments = data?.data?.data?.comments || [];
  const approvedComments = comments.filter((c) => c.isApproved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    createComment.mutate(
      {
        projectId,
        content: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
        },
      }
    );
  };

  const getUserName = (comment: typeof comments[0]) => {
    if (comment.user) {
      const { firstName, lastName } = comment.user;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      if (lastName) return lastName;
    }
    return "Anonymous";
  };

  const getUserInitials = (comment: typeof comments[0]) => {
    if (comment.user) {
      const { firstName, lastName } = comment.user;
      if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
      if (firstName) return firstName[0].toUpperCase();
      if (lastName) return lastName[0].toUpperCase();
    }
    return "A";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <IconMessage className="w-5 h-5" />
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          {approvedComments.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {approvedComments.length}
            </Badge>
          )}
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
              placeholder={t("placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mb-3"
            />
            <Button
              type="submit"
              disabled={!comment.trim() || createComment.isPending}
              className="w-full sm:w-auto"
            >
              <IconSend className="w-4 h-4 mr-2" />
              {createComment.isPending ? t("submitting") : t("submit")}
            </Button>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t("loginRequired")}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">{t("login")}</Link>
            </Button>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : approvedComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconMessage className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t("noComments")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvedComments.map((commentItem, index) => (
              <motion.div
                key={commentItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3"
              >
                <Avatar>
                  <AvatarImage
                    src={commentItem.user?.avatarUrl || undefined}
                    alt={getUserName(commentItem)}
                  />
                  <AvatarFallback>{getUserInitials(commentItem)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {getUserName(commentItem)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(commentItem.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {commentItem.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

