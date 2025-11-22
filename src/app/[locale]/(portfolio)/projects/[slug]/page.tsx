import { ProjectDetailsClient } from "./_components/project-details-client";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProjectDetailsClient params={params} />;
}

