"use client";

import { Mail, MapPin } from "lucide-react";
import { useCms } from "@/components/CmsProvider";
import HomeProfileCover from "@/components/HomeProfileCover";
import LineIcon from "@/components/LineIcon";

const LINE_URL = "https://line.me/ti/p/2j7MaV_2sN";
const CONTACT_EMAIL = "lungnuadnst@gmail.com";

export default function ContactPage() {
  const { cms } = useCms();
  const c = cms.contactPage;

  return (
    <div className="contact-premium-page">
      <section className="contact-premium-intro">
        <span className="eyebrow">CONTACT / START A PROJECT</span>
        <h1>{c.title}</h1>
        <p>{c.description}</p>
      </section>

      <HomeProfileCover cms={cms} />

      <section className="contact-premium-actions" aria-label="Contact Lungnuad Production">
        <a className="contact-line-card" href={LINE_URL} target="_blank" rel="noreferrer">
          <span className="contact-line-icon"><LineIcon /></span>
          <span>LINE</span>
          <strong>Add Lungnuad Production</strong>
        </a>

        <a href={`mailto:${CONTACT_EMAIL}`}>
          <span className="contact-action-icon"><Mail /></span>
          <span>Email</span>
          <strong>{CONTACT_EMAIL}</strong>
        </a>

        <div>
          <span className="contact-action-icon"><MapPin /></span>
          <span>พื้นที่ให้บริการ</span>
          <strong>{cms.site.serviceArea}</strong>
        </div>
      </section>
    </div>
  );
}
