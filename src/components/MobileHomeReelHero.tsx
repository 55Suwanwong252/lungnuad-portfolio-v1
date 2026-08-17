"use client";

import Link from "next/link";
import { ChevronDown, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCms } from "@/components/CmsProvider";

type Reel = { url: string; title: string; source?: "local" | "blob" | string };

const fallback: Reel = { url: "/media/reels/reel-01.mp4", title: "Reel 01", source: "local" };

export default function MobileHomeReelHero() {
  const { cms } = useCms();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reels, setReels] = useState<Reel[]>([fallback]);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    fetch("/api/reels", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data?.reels?.length) setReels(data.reels);
      })
      .catch(() => {});
  }, []);

  const selected =
    reels.find((item) => item.url === cms.homeReel.selectedUrl) ||
    reels[0] ||
    fallback;

  const meta = cms.reelMeta[selected.url] || {};
  const reelTitle = cms.homeReel.title || meta.title || selected.title;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 1;
    setMuted(true);
    video.play().catch(() => {});
  }, [selected.url]);

  async function toggleSound() {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.muted) {
        // iOS/Safari: unmute and play inside the same direct user gesture.
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
      // If Safari blocks the first attempt, keep UI truthful.
      setMuted(video.muted);
    }
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: reelTitle, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  function scrollToHome() {
    document.getElementById("home-content")?.scrollIntoView({ behavior: "smooth" });
  }

  const toneClass = cms.homeReel.textColor === "dark" ? "is-dark-text" : "is-light-text";
  const alignClass = cms.homeReel.textAlign === "center" ? "is-center" : "is-left";
  const sizeClass = `text-${cms.homeReel.textSize || "large"}`;

  return (
    <section className={`mobile-home-reel ${toneClass}`}>
      <video
        ref={videoRef}
        key={selected.url}
        src={selected.url}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
      />
      <div className="mobile-home-reel-shade" style={{ opacity: cms.homeReel.overlayOpacity }} />

      <div className={`mobile-home-reel-copy ${alignClass} ${sizeClass}`}>
        <span>{cms.homeReel.eyebrow}</span>
        <h1>{reelTitle}</h1>
        <p>{cms.homeReel.caption}</p>
        {cms.homeReel.showCta && <Link href="/reels">{cms.homeReel.ctaLabel}</Link>}
      </div>

      <div className="mobile-home-reel-actions">
        {cms.homeReel.showSound && (
          <button onClick={toggleSound} type="button">
            {muted ? <VolumeX /> : <Volume2 />}
            <small>{muted ? "Sound" : "Mute"}</small>
          </button>
        )}
        {cms.homeReel.showShare && (
          <button onClick={share} type="button">
            <Share2 />
            <small>Share</small>
          </button>
        )}
      </div>

      <button className="mobile-home-scroll" onClick={scrollToHome} type="button">
        <ChevronDown />
        <span>{cms.homeReel.scrollLabel}</span>
      </button>
    </section>
  );
}
