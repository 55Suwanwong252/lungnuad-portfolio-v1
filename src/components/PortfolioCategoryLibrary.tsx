"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import PortfolioCategoryNav from "@/components/PortfolioCategoryNav";
import {
  getPortfolioCategory,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import {
  portfolioVideosForCategory,
  type PortfolioLibraryWork,
} from "@/lib/portfolioVideoLibrary";

export default function PortfolioCategoryLibrary({
  slug,
}: {
  slug: PortfolioCategorySlug;
}) {
  const { cms } = useCms();
  const category = getPortfolioCategory(slug);
  const works = useMemo(
    () => portfolioVideosForCategory(slug, cms.projects),
    [cms.projects, slug]
  );
  const featured = works[0];
  const [watching, setWatching] = useState<PortfolioLibraryWork | null>(null);

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
          <span>{works.length} WORKS</span>
        </div>

        <PortfolioCategoryNav active={slug} />

        <header className="portfolio-category-header">
          <span>{category.eyebrow}</span>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </header>

        {featured && (
          <section
            className="category-featured"
            style={{ backgroundImage: `url("${featured.cover}")` }}
          >
            <div className="category-featured-shade" />
            <div className="category-featured-copy">
              <span>FEATURED</span>
              <h2>{featured.title}</h2>
              <p>{featured.subtitle}</p>
              <button type="button" onClick={() => setWatching(featured)}>
                <Play fill="currentColor" /> Play
              </button>
            </div>
          </section>
        )}

        <section className="category-library-section">
          <div className="category-library-head">
            <div>
              <span>FULL LIBRARY</span>
              <h2>{category.title}</h2>
            </div>
            <b>{works.length} works</b>
          </div>

          <div className="category-library-grid">
            {works.map((work) => (
              <article className="category-library-card" key={work.id}>
                <div
                  className="category-library-cover"
                  style={{ backgroundImage: `url("${work.cover}")` }}
                >
                  <span className="category-library-number">
                    {String(work.order).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="category-library-play"
                    onClick={() => setWatching(work)}
                    aria-label={`Play ${work.title}`}
                  >
                    <Play fill="currentColor" />
                  </button>
                </div>

                <div className="category-library-copy">
                  {work.projectSlug ? (
                    <Link href={`/projects/${work.projectSlug}`}>{work.title}</Link>
                  ) : (
                    <button
                      className="portfolio-work-title-button"
                      type="button"
                      onClick={() => setWatching(work)}
                    >
                      {work.title}
                    </button>
                  )}
                  <span>{work.client} · {work.year}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="category-share-panel category-share-minimal">
          <button type="button" className="category-share-primary category-share-only" onClick={sharePage}>
            SHARE
          </button>
        </section>
      </section>

      {watching && (
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
                src={`https://www.youtube-nocookie.com/embed/${watching.videoId}?autoplay=1&playsinline=1&rel=0&controls=1`}
                title={`${watching.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="watch-modal-info">
              <span>{category.title}</span>
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
    </div>
  );
}
