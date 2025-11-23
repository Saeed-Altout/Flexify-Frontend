"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  onFileSelect,
  onRemove,
  isUploading = false,
  disabled = false,
}: AvatarUploadProps) {
  const t = useTranslations("dashboard.testimonials.form");
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setPreview(currentAvatar || null);
  }, [currentAvatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square w-32 h-32 mx-auto">
              <Image
                src={preview}
                alt="Avatar preview"
                fill
                className="object-cover rounded-full"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              {!disabled && !isUploading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">
            {t("avatarUploadTitle") || "Upload Avatar"}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("avatarUploadDescription") || "Click or drag image to upload (max 5MB)"}
          </p>
        </div>
      )}
    </div>
  );
}

