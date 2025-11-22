import { Button } from "@/components/ui/button";
import { CV_URL } from "@/constants/site.constants";
import { IconFileDownload } from "@tabler/icons-react";

export function CVButton({ ...props }: React.ComponentProps<typeof Button>) {
  const onDownload = () => {
    const link = document.createElement("a");
    link.href = CV_URL;
    link.download = "Saeed-Altout-CV.pdf";
    link.click();
  };

  return (
    <Button variant="ghost" {...props} onClick={onDownload}>
      <IconFileDownload />
      Download CV
    </Button>
  );
}
