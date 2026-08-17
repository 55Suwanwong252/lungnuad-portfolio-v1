import Link from "next/link";
import { ArrowRight, CheckCircle2, Clapperboard, Eye, Heart, MapPin } from "lucide-react";
import { projects } from "@/lib/content";
export default function ProjectsPage(){
 const hero=projects[0];
 return <div className="light-page project-profile-page">
  <section className="project-profile-hero">
   <div className="project-cover-photo" style={{backgroundImage:`url(${hero.cover})`}}><div className="project-badges"><span><Clapperboard/> Visual Production</span><span className="status-dot"><i/>Available</span></div></div>
   <div className="project-profile-main"><div className="project-avatar"><img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad"/></div><div className="project-profile-copy"><h1>Lungnuad Production <CheckCircle2/></h1><p className="blue-tagline">Video · Photo · Storytelling</p><p>งานภาพและวิดีโอที่เน้นความชัดเจนของเรื่องราว อารมณ์ และภาพลักษณ์ เพื่อให้คนดูเข้าใจสิ่งที่คุณอยากสื่อได้เร็วขึ้น</p><div className="project-tags"><span>Commercial</span><span>Education</span><span>Corporate</span><span>Events</span></div></div><div className="profile-meta"><div><Eye/><b>{projects.length}</b><span>Projects</span></div><div><Heart/><b>15+</b><span>Years Experience</span></div><div><MapPin/><b>Thailand</b><span>Available Nationwide</span></div></div></div>
  </section>
  <section className="clean-section"><div className="section-head-light"><div><span>PORTFOLIO</span><h2>Selected Projects</h2></div></div><div className="project-clean-grid projects-three">{projects.map(p=><Link className="project-clean-card" href={`/projects/${p.slug}`} key={p.slug}><div className="project-clean-img" style={{backgroundImage:`url(${p.cover})`}}/><div className="project-clean-body"><span>{p.category}</span><h3>{p.title}</h3><p>{p.subtitle}</p><ArrowRight/></div></Link>)}</div></section>
 </div>
}
