import { Poppins } from "next/font/google";
import { ZapIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Routes } from "@/constants/routes";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        "flex items-center justify-center gap-2 font-bold",
        poppins.className,
        className
      )}
      href={Routes.home}
    >
      <ZapIcon className="size-6!" strokeWidth={3} />
      <span className="text-2xl">Flexify</span>
    </Link>
  );
}
