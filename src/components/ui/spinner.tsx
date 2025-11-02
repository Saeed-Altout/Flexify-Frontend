import { LoaderIcon } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("size-4 animate-spin", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function Spinner({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  );
}

export { Spinner };
