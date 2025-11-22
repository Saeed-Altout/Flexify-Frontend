"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageViewer } from "@/components/ui/image-viewer";
import { IProjectImage } from "@/modules/projects/projects-type";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: IProjectImage[];
  title?: string;
  maxVisible?: number;
  className?: string;
}

export function ProjectGallery({
  images,
  title,
  maxVisible = 3,
  className,
}: ProjectGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;

  const handleImageClick = (clickedIndex: number) => {
    // clickedIndex is the index in visibleImages, but we need the actual index in all images
    setInitialIndex(clickedIndex);
    setViewerOpen(true);
  };

  const handleMoreClick = () => {
    setInitialIndex(maxVisible);
    setViewerOpen(true);
  };

  const imageViewerData = images.map((img) => ({
    id: img.id,
    url: img.imageUrl,
    alt: img.altText || undefined,
  }));

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `Project image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {index === maxVisible - 1 && remainingCount > 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreClick();
                  }}
                >
                  <span className="text-white text-lg font-semibold">
                    +{remainingCount} {remainingCount === 1 ? "More" : "More"}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <ImageViewer
        images={imageViewerData}
        initialIndex={initialIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}

