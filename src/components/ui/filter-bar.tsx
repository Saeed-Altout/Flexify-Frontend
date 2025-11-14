"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Root component
interface FilterBarProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function FilterBarRoot({ className, children, ...props }: FilterBarProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

// Filter group component
function FilterBarGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-4 gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Filter item wrapper
function FilterBarItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

// Export compound components
export const FilterBar = Object.assign(FilterBarRoot, {
  Group: FilterBarGroup,
  Item: FilterBarItem,
});

