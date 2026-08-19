"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import PortfolioWatchPlayer from "@/components/PortfolioWatchPlayer";
import PortfolioStreamingHero from "@/components/PortfolioStreamingHero";
import PortfolioPosterImage from "@/components/PortfolioPosterImage";
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

      <div className="home-watch-rail-wrap">
        <div className="home-watch-rail" ref={railRef}>
        {shelf.works.map((work) => (
          <article className="home-watch-card" key={work.id}>
            <a
              className="home-watch-card-media home-watch-card-hitarea"
              href={`/watch/${shelf.key}/${work.videoId}`}
              onClick={(event) => {
                event.preventDefault();
                onWatch(work);
              }}
              aria-label={`Play ${work.title}`}
            >
              <PortfolioPosterImage
                src={work.poster}
                videoId={work.videoId}
                alt={work.title}
                eager={work.order <= 4}
              />
              <span className="home-watch-card-shade" />
              <span className="home-watch-card-year">
                {String(work.order).padStart(2, "0")}
              </span>
            </a>

            <div className="home-watch-card-copy">
              {work.projectSlug ? (
                <Link href={`/projects/${work.projectSlug}`}>{work.title}</Link>
              ) : (
                <a
                  className="portfolio-work-title-button"
                  href={`/watch/${shelf.key}/${work.videoId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onWatch(work);
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
        {showViewAll && (
          <Link
            className="home-watch-rail-view-all"
            href={portfolioCategoryPath(shelf.key)}
            aria-label={`ดูทั้งหมด — ${shelf.title}`}
          >
            <span>ดูทั้งหมด</span>
            <small>{shelf.works.length} คลิป</small>
          </Link>
        )}
      </div>
    </section>
  );
}

export default function HomeWorkShelves({
  projects,
  showExploreLink = true,
  showShelfViewAll = true,
  showStreamingHero = false,
  showCategoryStreamingHeroes = false,
}: {
  projects: Project[];
  showExploreLink?: boolean;
  showShelfViewAll?: boolean;
  showStreamingHero?: boolean;
  showCategoryStreamingHeroes?: boolean;
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
  const featuredShelf = shelves.find((shelf) => shelf.works.length > 0);
  const featuredWork = featuredShelf?.works[0];

  return (
    <>
      <section className={`home-watch-zone ${showCategoryStreamingHeroes ? "has-category-streaming-heroes" : ""}`}>
        {showCategoryStreamingHeroes && featuredWork && featuredShelf ? (
          <div className="home-streaming-lead-preview">
            <PortfolioStreamingHero
              work={featuredWork}
              categoryTitle={featuredShelf.title}
              onWatch={setWatching}
              priority
            />
          </div>
        ) : showStreamingHero && featuredWork && featuredShelf ? (
          <PortfolioStreamingHero
            work={featuredWork}
            categoryTitle={featuredShelf.title}
            onWatch={setWatching}
            priority
          />
        ) : null}

        <div className="home-watch-zone-head">
          <div>
            <span>WATCH / EXPLORE</span>
            <h2>Browse the work</h2>
            <p>เลือกชมแบบ Streaming — ตัวอย่างวิดีโอจะเล่นอัตโนมัติเมื่อเลื่อนมาถึง และกด Poster เพื่อดูฉบับเต็ม</p>
          </div>
          {showExploreLink && (
            <Link href="/projects">
              Explore all <ArrowRight />
            </Link>
          )}
        </div>

        <div className="home-watch-shelves">
          {shelves.map((shelf, index) => (
            <div className="home-streaming-category-block" key={shelf.key}>
              {showCategoryStreamingHeroes && index > 0 && shelf.works[0] && (
                <PortfolioStreamingHero
                  work={shelf.works[0]}
                  categoryTitle={shelf.title}
                  onWatch={setWatching}
                />
              )}
              <ShelfRow
                shelf={shelf}
                onWatch={setWatching}
                showViewAll={showShelfViewAll}
              />
            </div>
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
