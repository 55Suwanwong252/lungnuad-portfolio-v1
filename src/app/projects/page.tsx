"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clapperboard, Eye, Heart, MapPin } from "lucide-react";
import { useCms } from "@/components/CmsProvider";

export default function ProjectsPage() {
  const { cms } = useCms();
  const hero = cms.projects[0];
  const p = cms.projectsPage;

  return (
    <div className="light-page project-profile-page">
      <section className="project-profile-hero project-profile-v2">
        <div className="project-cover-photo project-cover-v2" style={{ backgroundImage: `url(${p.coverUrl || hero?.cover})` }}>
          <div className="project-badges">
            <span><Clapperboard /> Visual Production</span>
            <span className="status-dot"><i />Available</span>
          </div>
        </div>

        <div className="project-profile-main project-profile-main-v2">
          <div className="project-avatar project-avatar-v2">
            <img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad" />
          </div>

          <div className="project-profile-copy project-profile-copy-v2">
            <h1>{p.profileName}<CheckCircle2 /></h1>
            <p className="blue-tagline">{p.tagline}</p>
            <p className="project-profile-description">{p.description}</p>
            <div className="project-tags">{p.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>

          <div className="profile-meta profile-meta-v2">
            <div><Eye /><b>{cms.projects.length}</b><span>Projects</span></div>
            <div><Heart /><b>{p.experience}</b><span>Years Experience</span></div>
            <div><MapPin /><b>{p.location}</b><span>Available Nationwide</span></div>
          </div>
        </div>
      </section>

      <section className="clean-section projects-list-section">
        <div className="section-head-light"><div><span>PORTFOLIO</span><h2>{p.heading}</h2></div></div>
        <div className="project-clean-grid projects-three">
          {cms.projects.map((project) => (
            <Link className="project-clean-card" href={`/projects/${project.slug}`} key={project.slug}>
              <div className="project-clean-img" style={{ backgroundImage: `url(${project.cover})` }} />
              <div className="project-clean-body">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
