import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonStatistics() {
  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 md:h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 max-w-2xl mx-auto" />
        </div>

        {/* Statistics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6"
            >
              {/* Icon Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>

              {/* Value Skeleton */}
              <div className="mb-2 flex items-baseline gap-1">
                <Skeleton className="h-8 md:h-10 w-16" />
                <Skeleton className="h-8 md:h-10 w-4" />
              </div>

              {/* Label Skeleton */}
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

