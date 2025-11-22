"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ThumbnailUploadProps {
  currentThumbnail?: string | null;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export function ThumbnailUpload({
  currentThumbnail,
  onFileSelect,
  onRemove,
  isUploading = false,
  disabled = false,
}: ThumbnailUploadProps) {
  const t = useTranslations("dashboard.projects.form");
  const [preview, setPreview] = useState<string | null>(currentThumbnail || null);
  const [dragActive, setDragActive] = useState(false);

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
            <div className="relative aspect-video w-full">
              <Image
                src={preview}
                alt="Thumbnail preview"
                fill
                className="object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
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
            {t("thumbnail.uploadTitle") || "Upload Thumbnail"}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("thumbnail.uploadDescription") || "Click or drag image to upload (max 5MB)"}
          </p>
        </div>
      )}
    </div>
  );
}

