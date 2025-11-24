import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
  const onDownload = async () => {
    if (!cvUrl) return;

    try {
      // Fetch the file as a blob to force download
      const response = await fetch(cvUrl);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "CV.pdf";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading CV:", error);
      // Fallback: open in new tab if fetch fails
      const link = document.createElement("a");
      link.href = cvUrl;
      link.download = fileName || "CV.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!cvUrl) return null;

  return (
    <Button variant="ghost" {...props} onClick={onDownload}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
