import { IconBrandGithub } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function GithubButton({
  repoUrl,
  followers,
  ...props
}: React.ComponentProps<typeof Button> & {
  repoUrl: string;
  followers: number;
}) {
  return (
    <Button variant="ghost" asChild {...props}>
      <Link href={repoUrl}>
        <IconBrandGithub />
        {followers}
      </Link>
    </Button>
  );
}
