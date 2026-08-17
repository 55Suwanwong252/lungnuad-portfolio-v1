"use client";

import Link from "next/link";
import { ArrowUpRight, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Reel = {
  url: string;
  title: string;
  projectSlug?: string;
};

const fallback: Reel[] = [
  { url: "/media/reels/reel-01.mp4", title: "Reel 01" },
  { url: "/media/reels/reel-02.mp4", title: "Reel 02" },
  { url: "/media/reels/reel-03.mp4", title: "Reel 03" },
];

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>(fallback);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/reels")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.source === "blob") setReels(data.reels || []);
        else if (data?.reels?.length) setReels(data.reels);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refs.current.forEach((video, index) => {
      if (!video) return;

      video.muted = muted;
      video.volume = 1;

      if (index === active && !paused) video.play().catch(() => {});
      else video.pause();
    });
  }, [active, paused, muted, reels.length]);

  useEffect(() => {
    const elements = document.querySelectorAll(".video-reel-slide");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            const index = [...elements].indexOf(entry.target);
            if (index >= 0) {
              setActive(index);
              setPaused(false);
            }
          }
        }),
      { threshold: [0.65] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reels.length]);

  function toggleSound() {
    const video = refs.current[active];
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.volume = 1;
    setMuted(nextMuted);

    // Directly playing from the tap is important for iPhone/Safari audio.
    video.play().catch(() => {});
    setPaused(false);
  }

  const share = async () => {
    const url = location.href;
    if (navigator.share) {
      await navigator.share({ title: reels[active]?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (reels.length === 0) {
    return (
      <div className="reels-zero-state">
        <div>
          <span>LUNGNUAD REELS</span>
          <h1>ยังไม่มี Reel</h1>
          <p>เข้า Admin เพื่ออัปโหลดคลิปแรกของคุณ</p>
          <Link href="/studio">Open Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="video-reels-shell">
      <div className="video-reels-scroll">
        {reels.map((reel, index) => (
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

            <button className="reel-tap" onClick={() => setPaused((value) => !value)}>
              {paused && index === active ? <Play fill="currentColor" /> : <Pause fill="currentColor" />}
            </button>

            <div className="video-reel-info">
              <span>LUNGNUAD · REEL {String(index + 1).padStart(2, "0")}</span>
              <h1>{reel.title}</h1>
              <p>Visual story · Swipe up for next reel</p>
              {reel.projectSlug && (
                <Link href={`/projects/${reel.projectSlug}`}>
                  View project <ArrowUpRight />
                </Link>
              )}
            </div>

            <div className="video-reel-actions">
              <button onClick={toggleSound}>
                {muted ? <VolumeX /> : <Volume2 />}
                <small>{muted ? "Sound" : "Mute"}</small>
              </button>
              <button onClick={share}>
                <Share2 />
                <small>Share</small>
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
