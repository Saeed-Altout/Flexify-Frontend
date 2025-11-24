import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonAbout() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content Skeleton */}
          <div>
            {/* Title Skeleton */}
            <Skeleton className="h-10 md:h-12 w-48 mb-4" />

            {/* Description Paragraphs Skeleton */}
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>

            {/* CTA Button Skeleton */}
            <Skeleton className="h-11 w-32 rounded-lg" />
          </div>

          {/* Right Side - Highlights Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
              >
                {/* Icon Skeleton */}
                <div className="mb-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>

                {/* Title Skeleton */}
                <Skeleton className="h-6 w-24 mb-2" />

                {/* Description Skeleton */}
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

