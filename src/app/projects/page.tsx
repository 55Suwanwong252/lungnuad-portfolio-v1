"use client";

import { CheckCircle2, Clapperboard, Eye, Heart, MapPin } from "lucide-react";
import HomeWorkShelves from "@/components/HomeWorkShelves";
import PortfolioCategoryNav from "@/components/PortfolioCategoryNav";
import { useCms } from "@/components/CmsProvider";
import { totalPortfolioVideos } from "@/lib/portfolioVideoLibrary";

export default function ProjectsPage() {
  const { cms } = useCms();
  const hero = cms.projects[0];
  const p = cms.projectsPage;

  return (
    <div className="light-page project-profile-page portfolio-work-page">
      <section className="portfolio-browse-first">
        <PortfolioCategoryNav />
        <div className="browse-work-shell portfolio-browse-shell">
          <HomeWorkShelves
            projects={cms.projects}
            showExploreLink={false}
            showShelfViewAll
            showStreamingHero
          />
        </div>
      </section>

      <section className="project-profile-hero project-profile-v2 portfolio-profile-bottom">
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
            <div><Eye /><b>{totalPortfolioVideos()}</b><span>ผลงาน</span></div>
            <div><Heart /><b>{p.experience}</b><span>Years Experience</span></div>
            <div><MapPin /><b>{p.location}</b><span>Available Nationwide</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
