"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github, Calendar, Star, Heart } from "lucide-react";
import { format } from "date-fns";
import type { Project } from "@/types";

interface PreviewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function PreviewProjectModal({
  open,
  onOpenChange,
  project,
}: PreviewProjectModalProps) {
  const translation = project.translations?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translation?.title || "Untitled Project"}</DialogTitle>
          <DialogDescription>
            {translation?.summary || "No summary available"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Image */}
          {project.main_image && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border">
              <Image
                src={project.main_image}
                alt={translation?.title || "Project image"}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Status and Stats */}
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant={project.is_published ? "default" : "secondary"}>
              {project.is_published ? "Published" : "Draft"}
            </Badge>
            {project.average_rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {project.average_rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({project.total_ratings})
                </span>
              </div>
            )}
            {project.total_likes > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                <span>{project.total_likes}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {translation?.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {translation.description}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {translation?.features && translation.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {translation.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture */}
          {translation?.architecture && (
            <div>
              <h3 className="font-semibold mb-2">Architecture</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {translation.architecture}
              </p>
            </div>
          )}

          {/* Role */}
          {project.role && (
            <div>
              <h3 className="font-semibold mb-2">Role</h3>
              <p className="text-sm text-muted-foreground">{project.role}</p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {project.live_demo_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(project.live_demo_url!, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            )}
            {project.github_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(project.github_url!, "_blank")}
              >
                <Github className="mr-2 h-4 w-4" />
                Frontend Code
              </Button>
            )}
            {project.github_backend_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(project.github_backend_url!, "_blank")
                }
              >
                <Github className="mr-2 h-4 w-4" />
                Backend Code
              </Button>
            )}
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Additional Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {project.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden border"
                  >
                    <Image
                      src={image}
                      alt={`${translation?.title || "Project"} image ${
                        idx + 1
                      }`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
