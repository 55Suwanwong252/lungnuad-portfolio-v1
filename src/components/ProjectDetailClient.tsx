"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Send } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import MediaPlayer from "@/components/MediaPlayer";
import { useCms } from "@/components/CmsProvider";

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const { cms } = useCms();
  const project = cms.projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="page-wrap narrow-page">
        <span className="eyebrow">PROJECT</span>
        <h1 className="display-title">ไม่พบโปรเจค</h1>
        <Link href="/projects" className="primary-button inline-button">กลับ Projects</Link>
      </div>
    );
  }

  const related = cms.projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const gallery = project.gallery?.length ? project.gallery : [project.cover];

  return (
    <article className="project-detail page-wrap">
      <Link href="/projects" className="back-link"><ArrowLeft size={17}/>All projects</Link>

      <section className="project-detail-head">
        <div>
          <span className="eyebrow">{project.category} / {project.year}</span>
          <h1>{project.title}</h1>
          <p>{project.subtitle}</p>
        </div>
        <div className="project-facts">
          <div><span>CLIENT</span><b>{project.client}</b></div>
          <div><span>CATEGORY</span><b>{project.category}</b></div>
          <div><span>YEAR</span><b>{project.year}</b></div>
        </div>
      </section>

      <MediaPlayer project={project} />

      <section className="project-info-grid">
        <div><span className="eyebrow">About project</span><h2>เล่าเรื่องให้คนดูรู้สึก ก่อนที่จะอธิบาย.</h2></div>
        <div><p>{project.description}</p><div className="tag-row">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>
      </section>

      <section className="project-gallery-strip">
        {gallery.slice(0,4).map((image,i)=>
          <div key={`${image}-${i}`} style={{backgroundImage:`url("${image}")`}}><span>0{i+1}</span></div>
        )}
      </section>

      <section className="contact-cta">
        <div><span className="eyebrow">Have a project?</span><h2>{cms.contactPage.title}</h2></div>
        <Link className="primary-button" href="/contact"><Send size={18}/>Contact</Link>
      </section>

      <section className="section-block">
        <div className="section-title"><div><span className="eyebrow">Continue exploring</span><h2>Related projects</h2></div></div>
        <div className="card-grid">{related.map(item=><ProjectCard project={item} key={item.slug}/>)}</div>
      </section>

      <div className="edit-hint">
        ต้องการเปลี่ยนภาพ/วิดีโอของหน้านี้? เปิด <Link href="/studio">Content Studio <ArrowUpRight size={14}/></Link>
      </div>
    </article>
  );
}
