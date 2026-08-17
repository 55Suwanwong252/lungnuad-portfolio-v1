"use client";

import Link from "next/link";
import { ArrowUpRight, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCms } from "@/components/CmsProvider";

type Reel = { url: string; title: string; projectSlug?: string; source?: "local" | "blob" | string };

const fallback: Reel[] = [
  { url: "/media/reels/reel-01.mp4", title: "Reel 01" },
  { url: "/media/reels/reel-02.mp4", title: "Reel 02" },
  { url: "/media/reels/reel-03.mp4", title: "Reel 03" },
];

export default function ReelsPage() {
  const { cms } = useCms();
  const [rawReels, setRawReels] = useState<Reel[]>(fallback);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/reels", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.reels?.length) setRawReels(data.reels);
      })
      .catch(() => {});
  }, []);

  const ordered = [...rawReels]
    .filter((item) => cms.reelMeta[item.url]?.enabled !== false)
    .sort((a, b) => {
      const ai = cms.reelOrder.indexOf(a.url);
      const bi = cms.reelOrder.indexOf(b.url);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  useEffect(() => {
    refs.current.forEach((video, index) => {
      if (!video) return;
      video.muted = muted;
      video.volume = 1;
      if (index === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active, muted, ordered.length]);

  useEffect(() => {
    const elements = document.querySelectorAll(".video-reel-slide");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            const index = [...elements].indexOf(entry.target);
            if (index >= 0) setActive(index);
          }
        }),
      { threshold: [0.65] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ordered.length]);

  async function toggleSound() {
    const video = refs.current[active];
    if (!video) return;
    try {
      if (video.muted) {
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        await video.play();
        setMuted(false);
      } else {
        video.muted = true;
        video.defaultMuted = true;
        setMuted(true);
      }
    } catch {
      setMuted(video.muted);
    }
  }

  const share = async () => {
    const reel = ordered[active];
    const url = location.href;
    if (navigator.share) await navigator.share({ title: reel?.title, url });
    else await navigator.clipboard.writeText(url);
  };

  if (ordered.length === 0) {
    return (
      <div className="reels-zero-state">
        <div><span>LUNGNUAD REELS</span><h1>ยังไม่มี Reel</h1><p>เข้า Admin เพื่ออัปโหลดคลิปแรกของคุณ</p><Link href="/studio">Open Admin</Link></div>
      </div>
    );
  }

  return (
    <div className="video-reels-shell">
      <div className="video-reels-scroll">
        {ordered.map((reel, index) => {
          const meta = cms.reelMeta[reel.url] || {};
          return (
            <section className="video-reel-slide" key={reel.url}>
              <video
                ref={(element) => { refs.current[index] = element; }}
                src={reel.url}
                loop
                playsInline
                muted={muted}
                preload={index < 2 ? "auto" : "metadata"}
              />
              <div className="video-reel-shade" />

              <div className="video-reel-info">
                <span>LUNGNUAD · REEL {String(index + 1).padStart(2, "0")}</span>
                <h1>{meta.title || reel.title}</h1>
                <p>{meta.caption || "Visual story · Swipe up for next reel"}</p>
                {reel.projectSlug && <Link href={`/projects/${reel.projectSlug}`}>View project <ArrowUpRight /></Link>}
              </div>

              <div className="video-reel-actions">
                <button onClick={toggleSound}>
                  {muted ? <VolumeX /> : <Volume2 />}
                  <small>{muted ? "Sound" : "Mute"}</small>
                </button>
                <button onClick={share}><Share2 /><small>Share</small></button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
