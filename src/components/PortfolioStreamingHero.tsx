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
  const embedSrc = `https://www.youtube-nocookie.com/embed/${work.videoId}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&loop=1&playlist=${work.videoId}&modestbranding=1`;

  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "140px 0px", threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
            key={`${work.videoId}-${active ? "active" : "idle"}`}
            src={embedSrc}
            title={`${work.title} autoplay preview`}
            allow="autoplay; encrypted-media; picture-in-picture"
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
