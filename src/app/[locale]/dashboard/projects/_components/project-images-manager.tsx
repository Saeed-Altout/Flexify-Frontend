"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Loader2, GripVertical, Save, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useUploadProjectImageMutation,
  useDeleteProjectImageMutation,
} from "@/modules/projects/projects-hook";
import { IProjectImage } from "@/modules/projects/projects-type";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectImagesManagerProps {
  projectId: string;
  existingImages?: IProjectImage[];
  onImagesUpdate?: () => void;
}

interface SortableImageProps {
  image: IProjectImage;
  onDelete: (id: string) => void;
  onEdit: (image: IProjectImage) => void;
  isDeleting: boolean;
}

function SortableImage({
  image,
  onDelete,
  onEdit,
  isDeleting,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-video rounded-lg border bg-background",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <Image
        src={image.imageUrl}
        alt={image.altText || "Project image"}
        fill
        className="rounded-lg object-cover"
      />

      {/* Badges */}
      <div className="absolute left-2 top-2 flex gap-2">
        {image.isPrimary && (
          <Badge variant="default" className="text-xs">
            Primary
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          #{image.orderIndex + 1}
        </Badge>
      </div>

      {/* Actions */}
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(image)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 cursor-grab rounded-md bg-background/80 p-2 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Alt Text */}
      {image.altText && (
        <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {image.altText}
        </div>
      )}
    </div>
  );
}

export function ProjectImagesManager({
  projectId,
  existingImages = [],
  onImagesUpdate,
}: ProjectImagesManagerProps) {
  const t = useTranslations("dashboard.projects.form.images");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [images, setImages] = useState<IProjectImage[]>(existingImages);
  const [editingImage, setEditingImage] = useState<IProjectImage | null>(null);
  const [altText, setAltText] = useState("");

  const uploadImageMutation = useUploadProjectImageMutation();
  const deleteImageMutation = useDeleteProjectImageMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order_index for all items
        // TODO: Call API to update order in backend
        return newItems.map((item, index) => ({
          ...item,
          orderIndex: index,
        }));
      });
    }
  };

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
            orderIndex: images.length + i,
            isPrimary: images.length === 0 && i === 0,
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

  const handleEditImage = (image: IProjectImage) => {
    setEditingImage(image);
    setAltText(image.altText || "");
  };

  const handleSaveAltText = async () => {
    if (!editingImage) return;

    // TODO: Call API to update alt text
    console.log("Update alt text:", editingImage.id, altText);

    setEditingImage(null);
    setAltText("");

    if (onImagesUpdate) {
      onImagesUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Images with Drag & Drop */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("existing")}</CardTitle>
            <CardDescription>
              {t("dragToReorder") || "Drag images to reorder them"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      onDelete={handleDeleteExisting}
                      onEdit={handleEditImage}
                      isDeleting={deleteImageMutation.isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      {/* Upload New Images */}
      <Card>
        <CardHeader>
          <CardTitle>{t("addNew")}</CardTitle>
          <CardDescription>
            {t("uploadDescription") ||
              "Upload multiple images for your project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {t("uploadTitle") || "Upload Images"}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("uploadHint") ||
                "Click or drag images to upload (max 10MB each)"}
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  {t("selected")} ({selectedFiles.length})
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
                      {t("uploading")}
                    </>
                  ) : (
                    t("uploadAll")
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
        </CardContent>
      </Card>

      {/* Edit Alt Text Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("editAltText") || "Edit Image Alt Text"}
            </DialogTitle>
            <DialogDescription>
              {t("altTextDescription") ||
                "Add descriptive text for accessibility"}
            </DialogDescription>
          </DialogHeader>

          {editingImage && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={editingImage.imageUrl}
                  alt={editingImage.altText || ""}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altText">
                  {t("altTextLabel") || "Alt Text"}
                </Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder={
                    t("altTextPlaceholder") || "Describe this image..."
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)}>
              {t("cancel") || "Cancel"}
            </Button>
            <Button onClick={handleSaveAltText}>
              <Save className="mr-2 h-4 w-4" />
              {t("save") || "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
