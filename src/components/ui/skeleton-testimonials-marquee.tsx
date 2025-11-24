import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SkeletonTestimonialsMarquee() {
  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 md:h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 max-w-2xl mx-auto" />
        </div>

        {/* Testimonials Marquee Skeleton */}
        <div className="relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden">
          {/* First Marquee Row */}
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="w-64 flex-shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Second Marquee Row (Reverse) */}
          <div className="flex gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="w-64 flex-shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background/95 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background/95 to-transparent"></div>
          <div className="pointer-events-none absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background/90 to-transparent"></div>
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/90 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

