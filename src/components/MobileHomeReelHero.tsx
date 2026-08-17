"use client";

import Link from "next/link";
import { ChevronDown, Play, Pause, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Reel = { url: string; title: string };

const localFallback: Reel = {
  url: "/media/reels/reel-01.mp4",
  title: "Reel 01",
};

export default function MobileHomeReelHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reel, setReel] = useState<Reel>(localFallback);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/api/reels")
      .then((response) => response.json())
      .then((data) => {
        if (data?.reels?.length) setReel(data.reels[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = 1;

    if (!paused) video.play().catch(() => {});
    else video.pause();
  }, [muted, paused, reel.url]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.volume = 1;
    setMuted(nextMuted);

    // This call is inside the user's tap, so iOS is allowed to start audio.
    video.play().catch(() => {});
    setPaused(false);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: reel.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  function scrollToHome() {
    document.getElementById("home-content")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="mobile-home-reel">
      <video
        ref={videoRef}
        key={reel.url}
        src={reel.url}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
      />
      <div className="mobile-home-reel-shade" />

      <button
        className="mobile-home-reel-tap"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Play" : "Pause"}
      >
        {paused ? <Play fill="currentColor" /> : <Pause fill="currentColor" />}
      </button>

      <div className="mobile-home-reel-copy">
        <span>LUNGNUAD · FEATURED REEL</span>
        <h1>{reel.title}</h1>
        <p>Visual Story · เลื่อนลงเพื่อดู Portfolio</p>
        <Link href="/reels">ดู Reels ทั้งหมด</Link>
      </div>

      <div className="mobile-home-reel-actions">
        <button onClick={toggleSound}>
          {muted ? <VolumeX /> : <Volume2 />}
          <small>{muted ? "Sound" : "Mute"}</small>
        </button>
        <button onClick={share}>
          <Share2 />
          <small>Share</small>
        </button>
      </div>

      <button className="mobile-home-scroll" onClick={scrollToHome}>
        <ChevronDown />
        <span>Portfolio</span>
      </button>
    </section>
  );
}
