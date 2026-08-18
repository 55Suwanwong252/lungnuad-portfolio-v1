"use client";

import Link from "next/link";
import { ArrowRight, Camera, Clapperboard, GraduationCap, MapPin, Play, Sparkles } from "lucide-react";
import MobileHomeReelHero from "@/components/MobileHomeReelHero";
import HomeProfileCover from "@/components/HomeProfileCover";
import HomeWorkShelves from "@/components/HomeWorkShelves";
import { useCms } from "@/components/CmsProvider";

export default function Home() {
  const { cms } = useCms();
  const featured = cms.projects.find((p) => p.featured) || cms.projects[0];

  return (
    <>
      <MobileHomeReelHero />

      <div className="light-page" id="home-content">
        <HomeProfileCover cms={cms} />

        <section className="home-hero-light home-hero-after-cover home-hero-editorial home-mobile-late-story">
          <div className="hero-copy-light">
            <span className="light-kicker">{cms.home.heroEyebrow}</span>
            <h1>
              <span>{cms.home.heroTitle}</span>
              <strong>{cms.home.heroTitleThai}</strong>
            </h1>
            <p className="hero-lead">{cms.home.heroDescription}</p>

            <div className="hero-proof-tags" aria-label="Home hero tags">
              {cms.home.profileTags.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="hero-editorial-panel">
              <article>
                <small>SIGNATURE</small>
                <b>{cms.home.profileTagline}</b>
                <p>ภาพนิ่ง วิดีโอ และการเล่าเรื่องที่ช่วยให้แบรนด์ดูชัดขึ้นและน่าจดจำขึ้น</p>
              </article>
              <article>
                <small>FOCUS</small>
                <b>{cms.site.serviceArea}</b>
                <p>Commercial · Education · Corporate · Special Projects</p>
              </article>
            </div>

            <div className="hero-actions">
              <Link href="/projects" className="dark-cta">{cms.home.primaryCta} <ArrowRight /></Link>
              <Link href="/reels" className="ghost-cta"><Play fill="currentColor" />{cms.home.secondaryCta}</Link>
            </div>
          </div>

          <div className="hero-profile-card editorial-profile compact-profile">
            <img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad profile" />
            <div className="hero-profile-meta-card">
              <span>{cms.home.profileRole}</span>
              <h2>{cms.home.profileName}</h2>
              <p>{cms.home.location}</p>
            </div>
            <div className="hero-quick-facts">
              <div><small>Experience</small><b>{cms.home.experience} Years</b></div>
              <div><small>Available for</small><b>Video · Photo · Reels</b></div>
            </div>
          </div>
        </section>


        <section className="clean-section services-section-refined home-mobile-late-services">
          <div className="section-head-light services-section-head">
            <div>
              <span>WHAT I DO</span>
              <h2>{cms.home.servicesHeading}</h2>
            </div>
          </div>
          <div className="service-clean-grid service-module-grid">
            {cms.services.map((service, index) => (
              <article key={`${service.title}-${index}`} className="service-module-card">
                <div className="service-module-top">
                  <div className="service-icon">
                    {index === 0 ? <Clapperboard /> : index === 1 ? <Camera /> : index === 2 ? <Sparkles /> : <GraduationCap />}
                  </div>
                  <span className="service-order">0{index + 1}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="browse-work-section home-mobile-primary-browse">
          <div className="browse-work-shell">
            <HomeWorkShelves projects={cms.projects} />
          </div>
        </section>

        <section className="clean-contact home-mobile-contact">
          <div><MapPin /><span>{cms.site.serviceArea}</span></div>
          <Link href="/contact">Start a project <ArrowRight /></Link>
        </section>
        {featured && (
          <section className="clean-section home-mobile-selected-work">
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

      </div>
    </>
  );
}
