"use client";

import { ChevronLeft } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioLibraryWork } from "@/lib/portfolioVideoLibrary";
import PortfolioPosterImage from "@/components/PortfolioPosterImage";

export default function PortfolioWatchPlayer({
  current,
  works,
  categoryTitle,
  onClose,
  onSelect,
  mode = "portal",
}: {
  current: PortfolioLibraryWork | null;
  works: PortfolioLibraryWork[];
  categoryTitle: string;
  onClose: () => void;
  onSelect: (work: PortfolioLibraryWork) => void;
  mode?: "portal" | "inline";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const upNext = useMemo(() => {
    if (!current || works.length < 2) return [];

    const index = works.findIndex((work) => work.videoId === current.videoId);
    if (index < 0) return works.filter((work) => work.videoId !== current.videoId);

    return [
      ...works.slice(index + 1),
      ...works.slice(0, index),
    ].filter((work) => work.videoId !== current.videoId);
  }, [current, works]);

  useEffect(() => {
    if (!current) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [current, onClose]);

  if (!current || !mounted) return null;

  const titleClass =
    current.title.length > 72 ? "is-very-long" :
    current.title.length > 42 ? "is-long" : "";

  function choose(work: PortfolioLibraryWork) {
    onSelect(work);
    scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const playerNode = (
    <div className="portfolio-player-layer" role="dialog" aria-modal="true" aria-label={`${current.title} video`}>
      <div className="portfolio-player-scroll" ref={scrollerRef}>
        <div className="portfolio-player-card">
          <a
            className="portfolio-player-back"
            href="/projects"
            aria-label="กลับหน้าผลงานรวม"
          >
            <ChevronLeft />
          </a>

          <div className="portfolio-player-video">
            <iframe
              key={current.videoId}
              src={`https://www.youtube-nocookie.com/embed/${current.videoId}?autoplay=1&mute=0&playsinline=1&rel=0&controls=1&modestbranding=1`}
              title={`${current.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="portfolio-player-details">
            <div className="portfolio-player-heading">
              <span>{categoryTitle}</span>
              <h2 className={titleClass}>{current.title}</h2>
              <p>{current.client}</p>
            </div>

            <div className="portfolio-player-meta">
              <span>WORK {String(current.order).padStart(2, "0")}</span>
              <b>LUNGNUAD PRODUCTION</b>
            </div>
          </div>

          {upNext.length > 0 && (
            <section className="portfolio-player-next">
              <div className="portfolio-player-next-head">
                <div>
                  <span>CONTINUE WATCHING</span>
                  <h3>Up next</h3>
                </div>
                <small>{upNext.length} works</small>
              </div>

              <div className="portfolio-player-next-rail">
                {upNext.map((work) => (
                  <button
                    type="button"
                    className="portfolio-player-next-card"
                    onClick={() => choose(work)}
                    key={`${work.category}-${work.videoId}`}
                  >
                    <span className="portfolio-player-next-cover">
                      <PortfolioPosterImage
                        src={work.poster}
                        videoId={work.videoId}
                        alt={work.title}
                        eager={work.order <= 4}
                      />
                    </span>
                    <strong>{work.title}</strong>
                    <small>{String(work.order).padStart(2, "0")} · {categoryTitle}</small>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === "inline") return playerNode;

  return createPortal(playerNode, document.body);
}