"use client";
import { useLogoutMutation } from "@/modules/auth/auth-hook";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <Button onClick={() => logout()} loading={isPending}>
      Logout
    </Button>
  );
}
