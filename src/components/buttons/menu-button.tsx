import { IconMenu } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function MenuButton({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <IconMenu />
    </Button>
  );
}
