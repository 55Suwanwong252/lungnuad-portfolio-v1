"use client";

import { Camera, Check, MapPin, Sparkles } from "lucide-react";
import type { CmsContent } from "@/lib/cms";

export default function HomeProfileCover({ cms }: { cms: CmsContent }) {
  const h = cms.home;
  return (
    <section className="home-profile-cover">
      <div className="home-profile-cover-image" style={{ backgroundImage: `url("${h.coverUrl}")` }}>
        <div className="home-profile-cover-shade" />
        <div className="home-cover-badges">
          <span><Camera /> Visual Production</span>
          <span className="available"><i /> Available</span>
        </div>
      </div>

      <div className="home-profile-cover-info">
        <div className="home-cover-avatar-wrap">
          <img src="/media/profile/lungnuad-profile.webp" alt="Lungnuad" />
          <b><Check /></b>
        </div>

        <div className="home-cover-about">
          <span>{h.profileRole}</span>
          <h2>{h.profileName} <em><Check /></em></h2>
          <p>{h.profileTagline}</p>
          <small>{h.profileDescription}</small>
          <div className="home-cover-tags">
            {h.profileTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>

        <div className="home-cover-stats">
          <div><Sparkles /><b>{h.experience}</b><span>Years Experience</span></div>
          <div><MapPin /><b>{h.location}</b><span>Available Nationwide</span></div>
        </div>
      </div>
    </section>
  );
}
