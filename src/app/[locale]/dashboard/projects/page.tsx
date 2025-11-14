import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ProjectsPageClient } from "./projects-page-client";

export const metadata = {
  title: "Projects | Dashboard",
  description: "Manage your portfolio projects",
};

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <ProjectsPageClient />;
}
