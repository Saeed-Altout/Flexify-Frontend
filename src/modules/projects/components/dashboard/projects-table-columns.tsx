"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { Project } from "@/types";
import { format } from "date-fns";

interface ProjectsTableColumnsProps {
  onPreview?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

/**
 * Generate table columns for projects
 */
export function createProjectsColumns({
  onPreview,
  onEdit,
  onDelete,
}: ProjectsTableColumnsProps): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "translations",
      header: "Title",
      cell: ({ row }) => {
        const project = row.original;
        const translation = project.translations?.[0];
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {translation?.title || "Untitled Project"}
            </span>
            {translation?.summary && (
              <span className="text-sm text-muted-foreground line-clamp-1">
                {translation.summary}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tech_stack",
      header: "Tech Stack",
      cell: ({ row }) => {
        const techStack = row.original.tech_stack;
        if (!techStack || techStack.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {techStack.slice(0, 3).map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {techStack.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{techStack.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return <span className="text-sm">{row.original.role || "-"}</span>;
      },
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.original.is_published;
        return (
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "average_rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.average_rating;
        const totalRatings = row.original.total_ratings;
        if (totalRatings === 0) {
          return <span className="text-muted-foreground">No ratings</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({totalRatings})
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <span className="text-sm text-muted-foreground">
            {format(date, "MMM d, yyyy")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onPreview && (
                <DropdownMenuItem onClick={() => onPreview(project)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
              )}
              {project.live_demo_url && (
                <DropdownMenuItem
                  onClick={() => window.open(project.live_demo_url!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Demo
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(project)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
