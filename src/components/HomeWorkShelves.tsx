"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import PortfolioWatchPlayer from "@/components/PortfolioWatchPlayer";
import { useYouTubeTitles } from "@/lib/useYouTubeTitles";
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
              <a
                className="home-watch-card-play"
                href={`/watch/${shelf.key}/${work.videoId}`}
                onClick={(event) => {
                  if (!window.matchMedia("(max-width: 767px)").matches) {
                    event.preventDefault();
                    onWatch(work);
                  }
                }}
                aria-label={`Play ${work.title}`}
              >
                <Play fill="currentColor" />
              </a>
              <span className="home-watch-card-year">
                {String(work.order).padStart(2, "0")}
              </span>
            </div>

            <div className="home-watch-card-copy">
              {work.projectSlug ? (
                <Link href={`/projects/${work.projectSlug}`}>{work.title}</Link>
              ) : (
                <a
                  className="portfolio-work-title-button"
                  href={`/watch/${shelf.key}/${work.videoId}`}
                  onClick={(event) => {
                    if (!window.matchMedia("(max-width: 767px)").matches) {
                      event.preventDefault();
                      onWatch(work);
                    }
                  }}
                >
                  {work.title}
                </a>
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

  const rawShelves = useMemo<Shelf[]>(
    () =>
      PORTFOLIO_CATEGORIES.map((category) => ({
        key: category.slug,
        title: category.title,
        works: portfolioVideosForCategory(category.slug, projects),
      })),
    [projects]
  );

  const allVideoIds = useMemo(
    () => rawShelves.flatMap((shelf) => shelf.works.map((work) => work.videoId)),
    [rawShelves]
  );
  const youtubeMeta = useYouTubeTitles(allVideoIds);

  const shelves = useMemo<Shelf[]>(
    () =>
      rawShelves.map((shelf) => ({
        ...shelf,
        works: shelf.works.map((work) => ({
          ...work,
          title: youtubeMeta[work.videoId]?.title || work.title,
          client:
            work.client === "Lungnuad Production"
              ? youtubeMeta[work.videoId]?.author || work.client
              : work.client,
        })),
      })),
    [rawShelves, youtubeMeta]
  );

  const watchingResolved = watching
    ? shelves
        .flatMap((shelf) => shelf.works)
        .find((work) => work.videoId === watching.videoId) || watching
    : null;
  const watchingShelf = watchingResolved
    ? shelves.find((shelf) => shelf.key === watchingResolved.category)
    : undefined;

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

      <PortfolioWatchPlayer
        current={watchingResolved}
        works={watchingShelf?.works || []}
        categoryTitle={watchingShelf?.title || ""}
        onClose={() => setWatching(null)}
        onSelect={setWatching}
      />
    </>
  );
}
