"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/cms";
import {
  PORTFOLIO_CATEGORIES,
  portfolioCategoryPath,
  projectsForCategory,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import { youtubeVideoId } from "@/lib/youtube";

type Shelf = {
  key: PortfolioCategorySlug;
  title: string;
  projects: Project[];
};

function ShelfRow({
  shelf,
  onWatch,
  showViewAll,
}: {
  shelf: Shelf;
  onWatch: (project: Project) => void;
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
          <span>{shelf.projects.length} works</span>
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
        {shelf.projects.length === 0 ? (
          <article className="home-watch-card home-watch-empty-card">
            <div className="home-watch-card-media home-watch-empty-media">
              <span>MORE WORK SOON</span>
            </div>
            <div className="home-watch-card-copy">
              <span>Selected work coming soon</span>
            </div>
          </article>
        ) : (
          shelf.projects.map((project) => {
            const youtubeId =
              project.video?.type === "youtube"
                ? youtubeVideoId(project.video.src)
                : "";
            const playable = Boolean(youtubeId);

            return (
              <article className="home-watch-card" key={`${shelf.key}-${project.slug}`}>
                <div
                  className="home-watch-card-media"
                  style={{ backgroundImage: `url("${project.cover}")` }}
                >
                  <span className="home-watch-card-shade" />

                  {playable ? (
                    <button
                      className="home-watch-card-play"
                      type="button"
                      onClick={() => onWatch(project)}
                      aria-label={`Play ${project.title}`}
                    >
                      <Play fill="currentColor" />
                    </button>
                  ) : (
                    <Link
                      className="home-watch-card-play"
                      href={`/projects/${project.slug}`}
                      aria-label={`Open ${project.title}`}
                    >
                      <ArrowRight />
                    </Link>
                  )}

                  <span className="home-watch-card-year">{project.year}</span>
                </div>

                <div className="home-watch-card-copy">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  <span>{project.category}</span>
                </div>
              </article>
            );
          })
        )}
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
  const [watching, setWatching] = useState<Project | null>(null);

  const shelves = useMemo<Shelf[]>(
    () =>
      PORTFOLIO_CATEGORIES.map((category) => ({
        key: category.slug,
        title: category.title,
        projects: projectsForCategory(projects, category.slug),
      })),
    [projects]
  );

  const watchYoutubeId =
    watching?.video?.type === "youtube"
      ? youtubeVideoId(watching.video.src)
      : "";

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

      {watching && watchYoutubeId && (
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
                src={`https://www.youtube-nocookie.com/embed/${watchYoutubeId}?autoplay=1&playsinline=1&rel=0&controls=1`}
                title={`${watching.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="watch-modal-info">
              <span>{watching.category} · {watching.year}</span>
              <h2>{watching.title}</h2>
              <p>{watching.subtitle}</p>
              <Link href={`/projects/${watching.slug}`} onClick={() => setWatching(null)}>
                View project <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
