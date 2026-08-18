"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import PortfolioCategoryNav from "@/components/PortfolioCategoryNav";
import {
  getPortfolioCategory,
  projectsForCategory,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import { youtubeVideoId } from "@/lib/youtube";
import type { Project } from "@/lib/cms";

export default function PortfolioCategoryLibrary({
  slug,
}: {
  slug: PortfolioCategorySlug;
}) {
  const { cms } = useCms();
  const category = getPortfolioCategory(slug);
  const projects = useMemo(
    () => projectsForCategory(cms.projects, slug),
    [cms.projects, slug]
  );
  const featured = projects.find((project) => project.featured) || projects[0];
  const [watching, setWatching] = useState<Project | null>(null);

  const watchYoutubeId =
    watching?.video?.type === "youtube"
      ? youtubeVideoId(watching.video.src)
      : "";

  async function sharePage() {
    if (typeof window === "undefined") return;

    const shareData = {
      title: `${category.title} — Lungnuad Production`,
      text: `${category.title} — Lungnuad Production`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Keep the public UI minimal if clipboard access is unavailable.
    }
  }

  return (
    <div className="light-page portfolio-category-page">
      <section className="portfolio-category-shell">
        <div className="portfolio-category-topline">
          <Link href="/projects"><ArrowLeft /> ผลงานทั้งหมด</Link>
          <span>{projects.length} WORKS</span>
        </div>

        <PortfolioCategoryNav active={slug} />

        <header className="portfolio-category-header">
          <span>{category.eyebrow}</span>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </header>

        {featured ? (
          <section
            className="category-featured"
            style={{ backgroundImage: `url("${featured.cover}")` }}
          >
            <div className="category-featured-shade" />
            <div className="category-featured-copy">
              <span>FEATURED</span>
              <h2>{featured.title}</h2>
              <p>{featured.subtitle}</p>
              {featured.video?.type === "youtube" && youtubeVideoId(featured.video.src) ? (
                <button type="button" onClick={() => setWatching(featured)}>
                  <Play fill="currentColor" /> Play
                </button>
              ) : (
                <Link href={`/projects/${featured.slug}`}>
                  View project <ArrowRight />
                </Link>
              )}
            </div>
          </section>
        ) : (
          <section className="category-featured category-featured-empty">
            <div className="category-featured-copy">
              <span>COMING SOON</span>
              <h2>More work coming soon.</h2>
              <p>Selected films and visual stories will be added to this collection.</p>
            </div>
          </section>
        )}

        <section className="category-library-section">
          <div className="category-library-head">
            <div>
              <span>FULL LIBRARY</span>
              <h2>{category.title}</h2>
            </div>
            <b>{projects.length} works</b>
          </div>

          {projects.length > 0 ? (
            <div className="category-library-grid">
              {projects.map((project, index) => {
                const youtubeId =
                  project.video?.type === "youtube"
                    ? youtubeVideoId(project.video.src)
                    : "";

                return (
                  <article className="category-library-card" key={project.slug}>
                    <div
                      className="category-library-cover"
                      style={{ backgroundImage: `url("${project.cover}")` }}
                    >
                      <span className="category-library-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {youtubeId ? (
                        <button
                          type="button"
                          className="category-library-play"
                          onClick={() => setWatching(project)}
                          aria-label={`Play ${project.title}`}
                        >
                          <Play fill="currentColor" />
                        </button>
                      ) : (
                        <Link
                          className="category-library-play"
                          href={`/projects/${project.slug}`}
                          aria-label={`Open ${project.title}`}
                        >
                          <ArrowRight />
                        </Link>
                      )}
                    </div>

                    <div className="category-library-copy">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      <span>{project.client || project.category} · {project.year}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="category-library-empty-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="category-library-empty-card" key={index}>
                  <span>COMING SOON</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="category-share-panel category-share-minimal">
          <button type="button" className="category-share-primary category-share-only" onClick={sharePage}>
            SHARE
          </button>
        </section>
      </section>

      {watching && watchYoutubeId && (
        <div className="watch-modal" role="dialog" aria-modal="true" aria-label={`${watching.title} video`}>
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
              <span>{category.title} · {watching.year}</span>
              <h2>{watching.title}</h2>
              <p>{watching.subtitle}</p>
              <Link href={`/projects/${watching.slug}`} onClick={() => setWatching(null)}>
                View project <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
