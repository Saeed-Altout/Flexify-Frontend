import { AlertTriangleIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { BackButton } from "@/components/buttons/back-button";
import { HomeButton } from "@/components/buttons/home-button";

export default function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <HomeButton />
            <BackButton />
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
