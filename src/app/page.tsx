import Link from "next/link";
import { ArrowRight, Camera, Clapperboard, GraduationCap, MapPin, Play, Sparkles } from "lucide-react";
import MobileHomeReelHero from "@/components/MobileHomeReelHero";
import { projects, services } from "@/lib/content";

export default function Home() {
  const featured = projects[0];

  return (
    <>
      <MobileHomeReelHero />

      <div className="light-page" id="home-content">
        <section className="home-hero-light">
          <div className="hero-copy-light">
            <span className="light-kicker">LUNGNUAD PRODUCTION</span>
            <h1>Stories that move.<br />ภาพที่เล่าเรื่องแทนคุณ</h1>
            <p>Video production, photography และ visual storytelling สำหรับแบรนด์ องค์กร การศึกษา และงานพิเศษ</p>
            <div className="hero-actions">
              <Link href="/projects" className="dark-cta">ดูผลงาน <ArrowRight /></Link>
              <Link href="/reels" className="ghost-cta"><Play fill="currentColor" />ดู Reels</Link>
            </div>
          </div>

          <div className="hero-profile-card">
            <img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad profile" />
            <div>
              <span>Photographer · Filmmaker</span>
              <h2>Lungnuad</h2>
              <p>นครศรีธรรมราช · Thailand</p>
            </div>
          </div>
        </section>

        <section className="clean-section">
          <div className="section-head-light">
            <div><span>SELECTED WORK</span><h2>โปรเจคที่อยากให้คุณเริ่มดู</h2></div>
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

        <section className="clean-section">
          <div className="section-head-light">
            <div><span>WHAT I DO</span><h2>บริการหลัก</h2></div>
          </div>
          <div className="service-clean-grid">
            {services.map((service, index) => (
              <article key={service.title}>
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
            <div><span>EXPLORE</span><h2>งานล่าสุด</h2></div>
          </div>
          <div className="project-clean-grid">
            {projects.slice(0, 6).map((project) => (
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
          <div><MapPin /><span>Based in Southern Thailand · Available nationwide</span></div>
          <Link href="/contact">Start a project <ArrowRight /></Link>
        </section>
      </div>
    </>
  );
}
