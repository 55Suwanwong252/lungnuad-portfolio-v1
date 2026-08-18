"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/cms";
import {
  PORTFOLIO_CATEGORIES,
  portfolioCategoryPath,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import {
  portfolioVideosForCategory,
  type PortfolioLibraryWork,
} from "@/lib/portfolioVideoLibrary";

type Shelf = {
  key: PortfolioCategorySlug;
  title: string;
  works: PortfolioLibraryWork[];
};

function ShelfRow({
  shelf,
  onWatch,
  showViewAll,
}: {
  shelf: Shelf;
  onWatch: (work: PortfolioLibraryWork) => void;
  showViewAll: boolean;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.78, 320);
    rail.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section id={`shelf-${shelf.key}`} className="home-watch-shelf" aria-label={shelf.title}>
      <div className="home-watch-shelf-head">
        <div>
          <h3>{shelf.title}</h3>
          <span>{shelf.works.length} works</span>
        </div>

        <div className="home-watch-shelf-actions">
          {showViewAll && (
            <Link href={portfolioCategoryPath(shelf.key)}>View all</Link>
          )}
          <button type="button" onClick={() => scrollRail("left")} aria-label={`Previous ${shelf.title}`}>
            <ArrowLeft />
          </button>
          <button type="button" onClick={() => scrollRail("right")} aria-label={`Next ${shelf.title}`}>
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="home-watch-rail" ref={railRef}>
        {shelf.works.map((work) => (
          <article className="home-watch-card" key={work.id}>
            <div
              className="home-watch-card-media"
              style={{ backgroundImage: `url("${work.cover}")` }}
            >
              <span className="home-watch-card-shade" />
              <button
                className="home-watch-card-play"
                type="button"
                onClick={() => onWatch(work)}
                aria-label={`Play ${work.title}`}
              >
                <Play fill="currentColor" />
              </button>
              <span className="home-watch-card-year">
                {String(work.order).padStart(2, "0")}
              </span>
            </div>

            <div className="home-watch-card-copy">
              {work.projectSlug ? (
                <Link href={`/projects/${work.projectSlug}`}>{work.title}</Link>
              ) : (
                <button
                  className="portfolio-work-title-button"
                  type="button"
                  onClick={() => onWatch(work)}
                >
                  {work.title}
                </button>
              )}
              <span>{work.subtitle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomeWorkShelves({
  projects,
  showExploreLink = true,
  showShelfViewAll = true,
}: {
  projects: Project[];
  showExploreLink?: boolean;
  showShelfViewAll?: boolean;
}) {
  const [watching, setWatching] = useState<PortfolioLibraryWork | null>(null);

  const shelves = useMemo<Shelf[]>(
    () =>
      PORTFOLIO_CATEGORIES.map((category) => ({
        key: category.slug,
        title: category.title,
        works: portfolioVideosForCategory(category.slug, projects),
      })),
    [projects]
  );

  return (
    <>
      <section className="home-watch-zone">
        <div className="home-watch-zone-head">
          <div>
            <span>WATCH / EXPLORE</span>
            <h2>Browse the work</h2>
            <p>เลื่อนซ้าย–ขวาเพื่อเลือกชมผลงาน แล้วกด Play เพื่อดูต่อบนเว็บไซต์</p>
          </div>
          {showExploreLink && (
            <Link href="/projects">
              Explore all <ArrowRight />
            </Link>
          )}
        </div>

        <div className="home-watch-shelves">
          {shelves.map((shelf) => (
            <ShelfRow
              key={shelf.key}
              shelf={shelf}
              onWatch={setWatching}
              showViewAll={showShelfViewAll}
            />
          ))}
        </div>
      </section>

      {watching && (
        <div
          className="watch-modal home-watch-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${watching.title} video`}
        >
          <button
            className="watch-modal-close"
            type="button"
            onClick={() => setWatching(null)}
            aria-label="Close video"
          >
            <X />
          </button>

          <div className="watch-modal-shell">
            <div className="watch-modal-player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${watching.videoId}?autoplay=1&playsinline=1&rel=0&controls=1`}
                title={`${watching.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="watch-modal-info">
              <span>{watching.subtitle}</span>
              <h2>{watching.title}</h2>
              <p>{watching.client}</p>
              {watching.projectSlug && (
                <Link href={`/projects/${watching.projectSlug}`} onClick={() => setWatching(null)}>
                  View project <ArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
