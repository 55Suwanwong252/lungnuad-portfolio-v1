"use client";

import Link from "next/link";
import { ChevronDown, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCms } from "@/components/CmsProvider";

type Reel = { url: string; title: string; source?: "local" | "blob" | string };

const fallback: Reel = { url: "/media/reels/reel-01.mp4", title: "Reel 01", source: "local" };

export default function MobileHomeReelHero() {
  const { cms } = useCms();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const firstReelTapHandledRef = useRef(false);
  const [reels, setReels] = useState<Reel[]>([fallback]);
  const [muted, setMuted] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  const ensureAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay should preserve the video's CURRENT sound state.
    // Initial mounting sets the video to muted before this runs.
    // After a user explicitly unmutes, do not force it back to muted.
    if (video.muted) {
      video.defaultMuted = true;
      video.setAttribute("muted", "");
    } else {
      video.defaultMuted = false;
      video.removeAttribute("muted");
    }

    video.playsInline = true;

    try {
      await video.play();
      setPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      setPlaying(false);
      setAutoplayBlocked(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setMuted(true);
    setPlaying(false);
    setAutoplayBlocked(false);
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.volume = 1;

    const first = window.requestAnimationFrame(ensureAutoplay);
    const retryOne = window.setTimeout(ensureAutoplay, 160);
    const retryTwo = window.setTimeout(ensureAutoplay, 700);

    const onVisibility = () => {
      if (document.visibilityState === "visible") ensureAutoplay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(first);
      window.clearTimeout(retryOne);
      window.clearTimeout(retryTwo);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [selected.url, ensureAutoplay]);

  async function startMutedPlayback() {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      video.volume = 1;
      await video.play();
      setMuted(true);
      setPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  }

  async function handleFirstReelTap(event: ReactMouseEvent<HTMLElement>) {
    // Only a normal tap on the Reel surface should enable sound.
    // Buttons/links keep their existing behavior and do not trigger this.
    if (
      event.target instanceof Element &&
      event.target.closest("button, a, input, textarea, select, [role='button']")
    ) {
      return;
    }

    if (firstReelTapHandledRef.current) return;

    const video = videoRef.current;
    if (!video || !video.muted) return;

    try {
      // iOS/Safari requires unmute + play inside the direct tap gesture.
      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute("muted");
      video.volume = 1;

      await video.play();

      firstReelTapHandledRef.current = true;
      setMuted(false);
      setPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      // If the browser rejects this tap, leave the normal Sound button usable
      // and allow a later Reel-surface tap to try again.
      setMuted(video.muted);
    }
  }

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
        setPlaying(true);
        setAutoplayBlocked(false);
      } else {
        video.muted = true;
        video.defaultMuted = true;
        setMuted(true);
        setPlaying(!video.paused);
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
    <section
      className={`mobile-home-reel ${toneClass}`}
      onClick={handleFirstReelTap}
    >
      <video
        ref={videoRef}
        key={selected.url}
        src={selected.url}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onLoadedMetadata={ensureAutoplay}
        onCanPlay={ensureAutoplay}
        onPlaying={() => {
          setPlaying(true);
          setAutoplayBlocked(false);
        }}
        onPause={() => setPlaying(false)}
      />

      {autoplayBlocked && !playing && (
        <button
          className="mobile-home-reel-play-fallback"
          type="button"
          onClick={startMutedPlayback}
          aria-label="Play reel"
        >
          <Play fill="currentColor" />
          <span>PLAY</span>
        </button>
      )}

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
