import ProjectDetailClient from "@/components/ProjectDetailClient";
import { defaultCms } from "@/lib/cms";

export function generateStaticParams() {
  return defaultCms.projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}
