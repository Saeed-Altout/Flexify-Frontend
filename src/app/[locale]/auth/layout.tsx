import { Logo } from "@/components/common/logo";
import { ZapIcon } from "lucide-react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex lg:hidden justify-center gap-2 md:justify-start rtl:md:justify-end">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="relative hidden lg:block p-6">
        <div className="bg-background size-full flex justify-center items-center">
          <ZapIcon className="size-48" />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Flexify</h1>
            <p className="text-muted-foreground">
              Join the future of work with Flexify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
