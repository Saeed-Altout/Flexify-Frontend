import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner size="md" />
    </div>
  );
}
