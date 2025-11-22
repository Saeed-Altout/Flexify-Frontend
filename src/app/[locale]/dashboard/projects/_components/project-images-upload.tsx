"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useUploadProjectImageMutation,
  useDeleteProjectImageMutation,
} from "@/modules/projects/projects-hook";
import { IProjectImage } from "@/modules/projects/projects-type";

interface ProjectImagesUploadProps {
  projectId: string;
  existingImages?: IProjectImage[];
  onImagesUpdate?: () => void;
}

export function ProjectImagesUpload({
  projectId,
  existingImages = [],
  onImagesUpdate,
}: ProjectImagesUploadProps) {
  const t = useTranslations("dashboard.projects.form");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const uploadImageMutation = useUploadProjectImageMutation();
  const deleteImageMutation = useDeleteProjectImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles((prev) => [...prev, ...imageFiles]);
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

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadAll = async () => {
    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadingIndex(i);
      try {
        await uploadImageMutation.mutateAsync({
          projectId,
          file: selectedFiles[i],
          data: {
            orderIndex: existingImages.length + i,
            isPrimary: existingImages.length === 0 && i === 0,
          },
        });
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
    setUploadingIndex(null);
    setSelectedFiles([]);
    if (onImagesUpdate) {
      onImagesUpdate();
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (imageId: string) => {
    try {
      await deleteImageMutation.mutateAsync(imageId);
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("images.title") || "Project Images"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <Label>{t("images.existing") || "Existing Images"}</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {existingImages.map((image) => (
                <div key={image.id} className="group relative aspect-video">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText || "Project image"}
                    fill
                    className="rounded-lg object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Primary
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleDeleteExisting(image.id)}
                    disabled={deleteImageMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          <Label>{t("images.addNew") || "Add New Images"}</Label>

          <div
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">
              {t("images.uploadTitle") || "Upload Images"}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("images.uploadDescription") ||
                "Click or drag images to upload (max 10MB each)"}
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  {t("images.selected") || "Selected Images"} (
                  {selectedFiles.length})
                </Label>
                <Button
                  type="button"
                  onClick={handleUploadAll}
                  disabled={uploadImageMutation.isPending}
                  size="sm"
                >
                  {uploadImageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("images.uploading") || "Uploading..."}
                    </>
                  ) : (
                    t("images.uploadAll") || "Upload All"
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="group relative aspect-video">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    {uploadingIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {uploadingIndex !== index && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleRemoveSelected(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
