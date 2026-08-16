
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="page-wrap">
      <section className="page-heading">
        <div><span className="eyebrow">Real portfolio migration</span><h1>Projects</h1><p>รวมผลงานโฆษณา PR, Corporate Presentation, Education, Event และ Behind the Scene จากเว็บไซต์เดิมในโครงสร้างใหม่</p></div>
      </section>
      <section className="filter-row">{["ทั้งหมด","Commercial","Presentation","Education","PR","Event"].map((x,i)=><button className={`pill ${i===0?"active":""}`} key={x}>{x}</button>)}</section>
      <div className="card-grid">{projects.map(p=><ProjectCard key={p.slug} project={p}/>)}</div>
    </div>
  );
}
