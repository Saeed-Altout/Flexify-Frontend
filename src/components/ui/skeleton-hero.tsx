import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonHero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 text-center">
      {/* Badge Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-32 rounded-full mx-auto" />
      </div>

      {/* Main Heading Skeleton */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-12 md:h-16 lg:h-20 w-3/4 max-w-xl mx-auto" />
      </div>

      {/* Description Skeleton */}
      <div className="mb-8 space-y-2 max-w-3xl mx-auto">
        <Skeleton className="h-6 md:h-7 w-full" />
        <Skeleton className="h-6 md:h-7 w-5/6 mx-auto" />
        <Skeleton className="h-6 md:h-7 w-4/5 mx-auto" />
      </div>

      {/* CTA Button Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-12 w-48 rounded-lg mx-auto" />
      </div>

      {/* Tech Icons Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 w-6 md:h-8 md:w-8 rounded"
            style={{
              animationDelay: `${500 + i * 100}ms`,
            }}
          />
        ))}
      </div>
    </section>
  );
}

