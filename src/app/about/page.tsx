"use client";

import Link from "next/link";
import { ArrowRight, Camera, MonitorPlay, Mic2, Lightbulb } from "lucide-react";
import { useCms } from "@/components/CmsProvider";

export default function AboutPage() {
  const { cms } = useCms();
  const a = cms.aboutPage;
  return (
    <div className="page-wrap narrow-page">
      <span className="eyebrow">{a.eyebrow}</span>
      <h1 className="display-title">{a.title}</h1>
      <p className="lead">{a.description}</p>
      <div className="about-stats">
        {a.stats.map((s) => <div key={s.value}><b>{s.value}</b><span>{s.label}</span></div>)}
      </div>
      <div className="capability-grid">
        <div><Camera/><b>Production</b><span>กล้องและการถ่ายทำ</span></div>
        <div><Lightbulb/><b>Studio Lighting</b><span>ระบบไฟกองถ่าย</span></div>
        <div><MonitorPlay/><b>Post Production</b><span>ห้องตัดต่อ Professional</span></div>
        <div><Mic2/><b>Audio</b><span>ห้องบันทึกเสียงเฉพาะทาง</span></div>
      </div>
      <Link className="primary-button inline-button" href="/contact">{a.cta} <ArrowRight size={18}/></Link>
    </div>
  );
}
