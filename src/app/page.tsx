
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Clapperboard, HeartHandshake, Building2, GraduationCap } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/content";
import { reviews, services } from "@/lib/content";

const serviceIcons = [Clapperboard, HeartHandshake, Building2, GraduationCap];

export default function Home() {
  const featured = projects[0];
  const side = projects.slice(4, 6);

  return (
    <div className="page-wrap">
      <section className="page-heading">
        <div>
          <span className="eyebrow">Lung Nuad Production / Portfolio</span>
          <h1>Stories that move.</h1>
          <p>งานวิดีโอ ภาพนิ่ง โฆษณา พรีเซนเทชั่น การศึกษา งานอีเวนต์ และเรื่องราวที่ออกแบบให้ดูง่ายในประสบการณ์แบบ Feed + Reels + Project.</p>
        </div>
        <Link className="text-link" href="/projects">ดูผลงานทั้งหมด <ArrowRight size={18}/></Link>
      </section>

      <section className="filter-row">
        {["ทั้งหมด","Commercial","Presentation","Education","PR / Event"].map((x,i)=><button className={`pill ${i===0?"active":""}`} key={x}>{x}</button>)}
      </section>

      <section className="home-grid">
        <ProjectCard project={featured} featured />
        <div className="side-stack">{side.map(p=><ProjectCard project={p} key={p.slug}/>)}</div>
      </section>

      <section className="section-block">
        <div className="section-title"><div><span className="eyebrow">Featured commercials</span><h2>งานโฆษณาแนะนำ</h2></div><Sparkles size={22}/></div>
        <div className="card-grid">{projects.slice(0,4).map(p=><ProjectCard project={p} key={p.slug}/>)}</div>
      </section>

      <section className="section-block">
        <div className="section-title"><div><span className="eyebrow">What we do</span><h2>บริการผลิตสื่อ</h2></div></div>
        <div className="services-grid">
          {services.map((s,i)=>{ const Icon=serviceIcons[i]; return <div className="service-card" key={s.title}><Icon/><span>0{i+1}</span><h3>{s.title}</h3><p>{s.text}</p></div>})}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title"><div><span className="eyebrow">Portfolio work</span><h2>โปรเจคจริงจากผลงานเดิม</h2></div><Link className="text-link" href="/projects">Explore <ArrowRight size={18}/></Link></div>
        <div className="card-grid">{projects.slice(4,10).map(p=><ProjectCard project={p} key={p.slug}/>)}</div>
      </section>

      <section className="studio-panel">
        <div><span className="eyebrow">Production capability</span><h2>ครบตั้งแต่แนวคิด จนถึง Final Cut.</h2></div>
        <div className="studio-points"><span>Studio & Lighting</span><span>Professional Editing</span><span>Recording Room</span><span>Budget Planning</span></div>
      </section>

      <section className="section-block">
        <div className="section-title"><div><span className="eyebrow">Client reviews</span><h2>ความประทับใจจากลูกค้า</h2></div></div>
        <div className="reviews-grid">{reviews.map(r=><article className="review-card" key={r.name}><p>“{r.quote}”</p><div><b>{r.name}</b><span>{r.role}</span></div></article>)}</div>
      </section>

      <section className="reels-banner">
        <div><span className="eyebrow">Mobile first</span><h2>ดูผลงานต่อแบบ Reels.</h2><p>ปัดขึ้นลงเพื่อดูงานต่อเนื่อง แล้วแตะเข้า Project เพื่อดูรายละเอียดของงานนั้น</p></div>
        <Link className="primary-button" href="/reels"><Play size={18} fill="currentColor"/>Open Reels</Link>
      </section>
    </div>
  );
}
