import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { IconFileDownload } from "@tabler/icons-react";

export function CVButton({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" asChild {...props}>
      <Link href="/cv.pdf" target="_blank">
        <IconFileDownload />
        Download CV
      </Link>
    </Button>
  );
}
