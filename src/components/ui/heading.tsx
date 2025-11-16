import { cn } from "@/lib/utils";

export function Heading({
  title,
  description,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  title: string;
  description: string;
}) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
