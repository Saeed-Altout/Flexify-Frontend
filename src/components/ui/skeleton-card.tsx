import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "default" | "project" | "service" | "testimonial";
  className?: string;
}

export function SkeletonCard({
  variant = "default",
  className,
}: SkeletonCardProps) {
  if (variant === "project") {
    return (
      <div className={cn("rounded-lg border overflow-hidden", className)}>
        <Skeleton className="aspect-video w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "service") {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow h-full flex flex-col",
          className
        )}
      >
        {/* Icon/Tag Badge Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-8 w-10 rounded" />
        </div>
        {/* Title Skeleton */}
        <Skeleton className="h-7 w-3/4 mb-3" />
        {/* Description Skeleton */}
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === "testimonial") {
    return (
      <div className={cn("rounded-lg border p-6 space-y-4", className)}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border p-6 space-y-4", className)}>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
