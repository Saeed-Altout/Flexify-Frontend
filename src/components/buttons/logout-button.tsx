"use client";
import { useSignOutMutation } from "@/hooks/use-auth-mutations";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { mutate: signOut, isPending } = useSignOutMutation();

  return (
    <Button onClick={() => signOut()} loading={isPending}>
      Logout
    </Button>
  );
}
