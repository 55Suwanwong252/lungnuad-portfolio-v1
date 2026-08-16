
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Project } from "@/lib/content";

export default function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className={`project-card ${featured ? "featured" : ""}`}>
      <div className="project-card-media" style={{ backgroundImage: `url("${project.cover}")` }}>
        <div className="media-gradient" />
        <div className="play-chip"><Play size={17} fill="currentColor" /></div>
        <div className="project-card-title">
          <span>{project.title}</span>
          <strong>{project.subtitle}</strong>
        </div>
      </div>
      <div className="project-card-meta">
        <div><b>{project.client}</b><span>{project.category}</span></div>
        <div className="card-action">View Project <ArrowUpRight size={14}/></div>
      </div>
    </Link>
  );
}
