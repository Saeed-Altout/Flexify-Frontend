"use client";

import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LinkButton({
  label,
  href,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { label: string; href: string }) {
  const router = useRouter();

  if (!href || !label) return null;

  const handleRoute = () => {
    router.push(href);
  };

  return (
    <Button
      variant="link"
      type="button"
      className={cn(className)}
      onClick={handleRoute}
      {...props}
    >
      {label}
    </Button>
  );
}
