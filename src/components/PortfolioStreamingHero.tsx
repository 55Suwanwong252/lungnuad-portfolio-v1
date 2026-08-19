"use client";

import { Play, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioLibraryWork } from "@/lib/portfolioVideoLibrary";

export default function PortfolioStreamingHero({
  work,
  categoryTitle,
  onWatch,
  priority = false,
}: {
  work: PortfolioLibraryWork;
  categoryTitle: string;
  onWatch: (work: PortfolioLibraryWork) => void;
  priority?: boolean;
}) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(priority);
  const watchHref = `/watch/${work.category}/${work.videoId}`;
  const titleClass =
    work.title.length > 72 ? "is-very-long" :
    work.title.length > 42 ? "is-long" : "";
  const embedSrc = `https://www.youtube-nocookie.com/embed/${work.videoId}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&loop=1&playlist=${work.videoId}&modestbranding=1&iv_load_policy=3`;

  useEffect(() => {
    // Priority hero is already on-screen. Keep its iframe mounted so desktop
    // browsers do not briefly start and then destroy the autoplay preview.
    if (priority) {
      setActive(true);
      return;
    }

    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mobile) {
          // Preserve the mobile behavior that is already working well.
          setActive(entry.isIntersecting);
          return;
        }

        // Desktop: once a hero reaches the viewport, keep the iframe mounted.
        // This prevents the visible one-frame flash / immediate pause caused by
        // repeated mount-unmount cycles around the observer threshold.
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px", threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, work.videoId]);

  return (
    <section
      ref={heroRef}
      className="portfolio-streaming-hero"
      aria-label={`Featured ${work.title}`}
    >
      <div
        className="portfolio-streaming-hero-media"
        style={{ backgroundImage: `url("${work.cover}")` }}
      >
        {active && (
          <iframe
            key={work.videoId}
            src={embedSrc}
            title={`${work.title} autoplay preview`}
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="portfolio-streaming-hero-shade" />

      <div className="portfolio-streaming-hero-copy">
        <span>FEATURED · {categoryTitle}</span>
        <h2 className={titleClass}>{work.title}</h2>
        <p>{work.client}</p>
        <a
          href={watchHref}
          onClick={(event) => {
            event.preventDefault();
            onWatch(work);
          }}
        >
          <Play fill="currentColor" /> Watch now
        </a>
      </div>

      <div className="portfolio-streaming-hero-status">
        <VolumeX /> {active ? "AUTOPLAY · MUTED" : "PREVIEW"}
      </div>
    </section>
  );
}
