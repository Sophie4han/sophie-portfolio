import { HomePage } from "@/components/home/HomePage";
import { ProjectEntry } from "@/components/home/ProjectEntry";
import { HOME_PROJECTS } from "@/lib/home-projects";

export default async function Home({ searchParams }: PageProps<"/">) {
  const query = await searchParams;
  const project = HOME_PROJECTS.find((item) => item.id === query.project);
  if (project || query.experience === "world") {
    return <ProjectEntry projectId={project?.id} />;
  }
  return <HomePage />;
}
