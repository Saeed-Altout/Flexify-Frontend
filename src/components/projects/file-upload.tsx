"use client";

import * as React from "react";
import { Upload, X, Image as ImageIcon, Video, FileImage } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string | string[];
  onChange: (value: string | string[] | undefined) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  description?: string;
  error?: string;
  type?: "image" | "video" | "all";
}

export function FileUpload({
  value,
  onChange,
  accept,
  multiple = false,
  maxFiles,
  label,
  description,
  error,
  type = "image",
}: FileUploadProps) {
  const t = useTranslations("auth.projects.dashboard.form");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const currentValue = Array.isArray(value) ? value : value ? [value] : [];

  React.useEffect(() => {
    setPreviewUrls(currentValue);
  }, [value]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (type === "image") {
        return file.type.startsWith("image/");
      }
      if (type === "video") {
        return file.type.startsWith("video/");
      }
      return true;
    });

    // Check for invalid file types
    if (validFiles.length !== fileArray.length) {
      const fileTypeName = type === "image" ? t("uploadFileTypeImage") : type === "video" ? t("uploadFileTypeVideo") : "files";
      setUploadError(t("uploadInvalidFileType", { type: fileTypeName }));
      return;
    }

    // Check total files if multiple
    if (multiple && maxFiles) {
      const totalFiles = currentValue.length + validFiles.length;
      if (totalFiles > maxFiles) {
        setUploadError(t("uploadTooManyFiles", { max: maxFiles }));
        return;
      }
    } else if (maxFiles && validFiles.length > maxFiles) {
      setUploadError(t("uploadTooManyFiles", { max: maxFiles }));
      return;
    }

    try {
      // TODO: Implement proper file upload to server/CDN
      // Currently using blob URLs which are temporary and won't persist
      // In production, upload files to S3, Cloudinary, or your server and get back permanent URLs
      
      // For now, convert files to base64 data URLs so they can be stored in the database
      // Note: This is not ideal for large files, but works for now
      const filePromises = validFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      const newUrls = await Promise.all(filePromises);
      
      if (multiple) {
        const updated = [...currentValue, ...newUrls];
        onChange(updated.length > 0 ? updated : undefined);
      } else {
        onChange(newUrls[0]);
      }
    } catch (err) {
      setUploadError(t("uploadError"));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated.length > 0 ? updated : undefined);
    } else {
      onChange(undefined);
    }
  };

  const getAcceptType = () => {
    if (accept) return accept;
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    return "*/*";
  };

  const getIcon = () => {
    if (type === "image") return <ImageIcon className="h-5 w-5" />;
    if (type === "video") return <Video className="h-5 w-5" />;
    return <FileImage className="h-5 w-5" />;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          error && "border-destructive"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={getAcceptType()}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-muted-foreground">{getIcon()}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragging 
                ? t("uploadDropHere") 
                : t("uploadClickOrDrag")}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadSelectFiles")}
          </Button>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded-lg overflow-hidden border bg-muted shadow-sm hover:shadow-md transition-shadow"
            >
              {type === "image" ? (
                <img
                  src={url}
                  alt={t("uploadPreviewImage", { number: index + 1 })}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                  aria-label={t("uploadPreviewVideo", { number: index + 1 })}
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 shadow-lg"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-destructive mt-1">{error || uploadError}</p>
      )}
    </div>
  );
}

