"use client";

import Link from "next/link";
import { ArrowRight, Camera, Clapperboard, GraduationCap, MapPin, Play, Sparkles } from "lucide-react";
import MobileHomeReelHero from "@/components/MobileHomeReelHero";
import HomeProfileCover from "@/components/HomeProfileCover";
import { useCms } from "@/components/CmsProvider";

export default function Home() {
  const { cms } = useCms();
  const featured = cms.projects.find((p) => p.featured) || cms.projects[0];

  return (
    <>
      <MobileHomeReelHero />

      <div className="light-page" id="home-content">
        <HomeProfileCover cms={cms} />

        <section className="home-hero-light home-hero-after-cover">
          <div className="hero-copy-light">
            <span className="light-kicker">{cms.home.heroEyebrow}</span>
            <h1>{cms.home.heroTitle}<br />{cms.home.heroTitleThai}</h1>
            <p>{cms.home.heroDescription}</p>
            <div className="hero-actions">
              <Link href="/projects" className="dark-cta">{cms.home.primaryCta} <ArrowRight /></Link>
              <Link href="/reels" className="ghost-cta"><Play fill="currentColor" />{cms.home.secondaryCta}</Link>
            </div>
          </div>

          <div className="hero-profile-card compact-profile">
            <img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad profile" />
            <div>
              <span>{cms.home.profileRole}</span>
              <h2>{cms.home.profileName}</h2>
              <p>{cms.home.location}</p>
            </div>
          </div>
        </section>

        {featured && (
          <section className="clean-section">
            <div className="section-head-light">
              <div><span>SELECTED WORK</span><h2>{cms.home.selectedHeading}</h2></div>
              <Link href="/projects">View all <ArrowRight /></Link>
            </div>
            <div className="feature-story-card" style={{ backgroundImage: `url(${featured.cover})` }}>
              <div className="feature-story-overlay" />
              <div className="feature-story-copy">
                <span>{featured.category}</span>
                <h3>{featured.title}</h3>
                <p>{featured.subtitle}</p>
                <Link href={`/projects/${featured.slug}`}>เปิดโปรเจค <ArrowRight /></Link>
              </div>
            </div>
          </section>
        )}

        <section className="clean-section">
          <div className="section-head-light">
            <div><span>WHAT I DO</span><h2>{cms.home.servicesHeading}</h2></div>
          </div>
          <div className="service-clean-grid">
            {cms.services.map((service, index) => (
              <article key={`${service.title}-${index}`}>
                <div className="service-icon">
                  {index === 0 ? <Clapperboard /> : index === 1 ? <Camera /> : index === 2 ? <Sparkles /> : <GraduationCap />}
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="clean-section">
          <div className="section-head-light">
            <div><span>EXPLORE</span><h2>{cms.home.latestHeading}</h2></div>
          </div>
          <div className="project-clean-grid">
            {cms.projects.slice(0, 6).map((project) => (
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

        <section className="clean-contact">
          <div><MapPin /><span>{cms.site.serviceArea}</span></div>
          <Link href="/contact">Start a project <ArrowRight /></Link>
        </section>
      </div>
    </>
  );
}
