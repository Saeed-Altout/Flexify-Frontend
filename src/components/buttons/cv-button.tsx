import { Button } from "@/components/ui/button";
import { IconFileDownload } from "@tabler/icons-react";

export function CVButton({
  cvUrl,
  fileName,
  label = "Download CV",
  ...props
}: React.ComponentProps<typeof Button> & {
  cvUrl?: string;
  fileName?: string;
  label?: string;
}) {
  const onDownload = () => {
    if (!cvUrl) return;
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = fileName || "CV.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  if (!cvUrl) return null;

  return (
    <Button variant="ghost" {...props} onClick={onDownload}>
      <IconFileDownload />
      {label}
    </Button>
  );
}
