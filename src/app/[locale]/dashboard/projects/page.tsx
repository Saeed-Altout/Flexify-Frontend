import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";

import { ProjectsPageClient } from "./_components/projects-page-client";

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
