
"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { projects } from "@/lib/content";
import { useEffect, useRef, useState } from "react";

export default function ReelsPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>(".reel-slide"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > .6) {
          const index = slides.indexOf(entry.target as HTMLElement);
          if (index >= 0) { setActive(index); setPaused(false); }
        }
      });
    }, { root, threshold: [.6, .8] });
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(projects.length - 1, active + dir));
    scroller.current?.querySelectorAll<HTMLElement>(".reel-slide")[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const share = async () => {
    const p = projects[active];
    const url = `${window.location.origin}/projects/${p.slug}`;
    if (navigator.share) await navigator.share({ title: p.title, text: p.subtitle, url });
    else { await navigator.clipboard.writeText(url); alert("คัดลอกลิงก์ Project แล้ว"); }
  };

  return (
    <div className="reels-page">
      <div className="reels-topbar">
        <div><strong>REELS</strong><span>Swipe / scroll to explore</span></div>
        <div className="reels-counter">{String(active+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</div>
      </div>

      <div className="reels-scroller" ref={scroller}>
        {projects.map((project, index) => (
          <section className={`reel-slide ${index===active ? "is-active":""}`} key={project.slug}>
            <div className={`reel-background ${paused && index===active ? "is-paused":""}`} style={{ backgroundImage: `url("${project.vertical}")` }} />
            <div className="reel-overlay" />
            <button className="reel-center-toggle" onClick={()=>setPaused(v=>!v)} aria-label="Play or pause">
              {paused && index===active ? <Play fill="currentColor"/> : <Pause fill="currentColor"/>}
            </button>

            <div className="reel-copy">
              <span className="reel-kicker">{project.category}</span>
              <h1>{project.title}</h1>
              <p>{project.subtitle}</p>
              <div className="reel-tags">{project.tags.map(tag=><span key={tag}>#{tag.replace(/\s+/g,"")}</span>)}</div>
              <Link href={`/projects/${project.slug}`} className="reel-project-link">View full project <ArrowUpRight size={16}/></Link>
            </div>

            <div className="reel-actions">
              <button onClick={()=>setPaused(v=>!v)} aria-label="Play pause">{paused && index===active ? <Play/>:<Pause/>}<small>{paused && index===active?"Play":"Pause"}</small></button>
              <button onClick={()=>setMuted(v=>!v)} aria-label="Mute">{muted?<VolumeX/>:<Volume2/>}<small>{muted?"Muted":"Sound"}</small></button>
              <button onClick={share} aria-label="Share"><Share2/><small>Share</small></button>
            </div>

            <div className="reel-progress"><i style={{width:index===active && !paused ? "72%" : index<active ? "100%" : "0%"}} /></div>
          </section>
        ))}
      </div>

      <div className="reel-nav">
        <button onClick={()=>go(-1)} disabled={active===0}><ChevronUp/></button>
        <button onClick={()=>go(1)} disabled={active===projects.length-1}><ChevronDown/></button>
      </div>
    </div>
  );
}
