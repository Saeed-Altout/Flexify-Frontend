import { cn } from "@/lib/utils"

function Skeleton({ 
  className, 
  variant = "default",
  ...props 
}: React.ComponentProps<"div"> & {
  variant?: "default" | "text" | "circular" | "rectangular";
}) {
  const variantClasses = {
    default: "rounded-md",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted animate-pulse",
        variantClasses[variant],
        className
      )}
      aria-label="Loading..."
      role="status"
      {...props}
    />
  )
}

export { Skeleton }
