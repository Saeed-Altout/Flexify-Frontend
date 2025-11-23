"use client";
import { useLogoutMutation } from "@/modules/auth/auth-hook";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
}

export function LogoutButton({ 
  children, 
  className,
  asChild = false 
}: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogoutMutation();

  if (asChild && children) {
    return (
      <div onClick={() => logout()} className={className}>
        {children}
      </div>
    );
  }

  return (
    <Button onClick={() => logout()} disabled={isPending} className={className}>
      {children || "Logout"}
    </Button>
  );
}
