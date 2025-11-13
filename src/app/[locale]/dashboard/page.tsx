import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <p>Welcome, {session.user?.email || "User"}!</p>
        <p>You are successfully authenticated.</p>
      </div>
    </div>
  );
}
