"use client";

import { Camera, Check, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeProfileCover({ defaultCover }: { defaultCover: string }) {
  const [coverUrl, setCoverUrl] = useState(defaultCover);

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const saved = data?.settings?.homeCoverUrl;
        if (saved) setCoverUrl(saved);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="home-profile-cover">
      <div
        className="home-profile-cover-image"
        style={{ backgroundImage: `url("${coverUrl}")` }}
      >
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
          <span>Photographer · Filmmaker</span>
          <h2>Lungnuad Production <em><Check /></em></h2>
          <p>Video · Photo · Storytelling</p>
          <small>งานภาพและวิดีโอที่เน้นความชัดเจนของเรื่องราว อารมณ์ และภาพลักษณ์ เพื่อให้คนดูเข้าใจสิ่งที่คุณอยากสื่อได้เร็วขึ้น</small>
          <div className="home-cover-tags">
            <span>Commercial</span><span>Education</span><span>Corporate</span><span>Events</span>
          </div>
        </div>

        <div className="home-cover-stats">
          <div><Sparkles /><b>15+</b><span>Years Experience</span></div>
          <div><MapPin /><b>Thailand</b><span>Available Nationwide</span></div>
        </div>
      </div>
    </section>
  );
}
