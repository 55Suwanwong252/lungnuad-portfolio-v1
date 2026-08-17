"use client";

import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useCms } from "@/components/CmsProvider";

export default function ContactPage() {
  const { cms } = useCms();
  const c = cms.contactPage;
  return (
    <div className="page-wrap narrow-page">
      <span className="eyebrow">{c.eyebrow}</span>
      <h1 className="display-title">{c.title}</h1>
      <p className="lead">{c.description}</p>
      <div className="contact-list">
        <a href={`mailto:${cms.site.email}`}><Mail/><span>Email</span><b>{cms.site.email}</b></a>
        <a href={cms.site.facebookUrl} target="_blank" rel="noreferrer"><MessageCircle/><span>Facebook Page</span><b>{cms.site.facebookLabel}</b></a>
        <div><MapPin/><span>พื้นที่ให้บริการ</span><b>{cms.site.serviceArea}</b></div>
      </div>
    </div>
  );
}
