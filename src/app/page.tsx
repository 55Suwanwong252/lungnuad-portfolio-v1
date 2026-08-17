import Link from "next/link";
import { ArrowRight, Camera, Clapperboard, GraduationCap, MapPin, Play, Sparkles } from "lucide-react";
import MobileReelRedirect from "@/components/MobileReelRedirect";
import { projects, services } from "@/lib/content";

export default function Home(){
 const featured=projects[0];
 return <div className="light-page"><MobileReelRedirect/>
  <section className="home-hero-light">
   <div className="hero-copy-light"><span className="light-kicker">LUNGNUAD PRODUCTION</span><h1>Stories that move.<br/>ภาพที่เล่าเรื่องแทนคุณ</h1><p>Video production, photography และ visual storytelling สำหรับแบรนด์ องค์กร การศึกษา และงานพิเศษ</p><div className="hero-actions"><Link href="/projects" className="dark-cta">ดูผลงาน <ArrowRight/></Link><Link href="/reels" className="ghost-cta"><Play fill="currentColor"/>ดู Reels</Link></div></div>
   <div className="hero-profile-card"><img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad profile"/><div><span>Photographer · Filmmaker</span><h2>Lungnuad</h2><p>นครศรีธรรมราช · Thailand</p></div></div>
  </section>
  <section className="clean-section"><div className="section-head-light"><div><span>SELECTED WORK</span><h2>โปรเจคที่อยากให้คุณเริ่มดู</h2></div><Link href="/projects">View all <ArrowRight/></Link></div>
   <div className="feature-story-card" style={{backgroundImage:`url(${featured.cover})`}}><div className="feature-story-overlay"/><div className="feature-story-copy"><span>{featured.category}</span><h3>{featured.title}</h3><p>{featured.subtitle}</p><Link href={`/projects/${featured.slug}`}>เปิดโปรเจค <ArrowRight/></Link></div></div>
  </section>
  <section className="clean-section"><div className="section-head-light"><div><span>WHAT I DO</span><h2>บริการหลัก</h2></div></div><div className="service-clean-grid">{services.map((s,i)=><article key={s.title}><div className="service-icon">{i===0?<Clapperboard/>:i===1?<Camera/>:i===2?<Sparkles/>:<GraduationCap/>}</div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></section>
  <section className="clean-section"><div className="section-head-light"><div><span>EXPLORE</span><h2>งานล่าสุด</h2></div></div><div className="project-clean-grid">{projects.slice(0,6).map(p=><Link className="project-clean-card" href={`/projects/${p.slug}`} key={p.slug}><div className="project-clean-img" style={{backgroundImage:`url(${p.cover})`}}/><div className="project-clean-body"><span>{p.category}</span><h3>{p.title}</h3><p>{p.subtitle}</p><ArrowRight/></div></Link>)}</div></section>
  <section className="clean-contact"><div><MapPin/><span>Based in Southern Thailand · Available nationwide</span></div><Link href="/contact">Start a project <ArrowRight/></Link></section>
 </div>
}
