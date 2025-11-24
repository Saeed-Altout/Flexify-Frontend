import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCTA() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title Skeleton */}
          <Skeleton className="h-10 md:h-12 w-80 mx-auto mb-4" />

          {/* Description Skeleton */}
          <div className="mb-8 space-y-2">
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-4/5 max-w-xl mx-auto" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 rounded-lg mx-auto sm:mx-0" />
            <Skeleton className="h-12 w-40 rounded-lg mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

