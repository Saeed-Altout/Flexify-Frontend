import { Image } from "@/components/ui/image";
import { Logo } from "@/components/common/logo";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start rtl:md:justify-end">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/bg-auth.jpg"
          alt="bg-auth"
          fill
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
