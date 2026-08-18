"use client";

import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { useMemo, useState } from "react";
import PortfolioWatchPlayer from "@/components/PortfolioWatchPlayer";
import { useYouTubeTitles } from "@/lib/useYouTubeTitles";
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
  const rawWorks = useMemo(
    () => portfolioVideosForCategory(slug, cms.projects),
    [cms.projects, slug]
  );
  const youtubeMeta = useYouTubeTitles(rawWorks.map((work) => work.videoId));
  const works = useMemo(
    () =>
      rawWorks.map((work) => ({
        ...work,
        title: youtubeMeta[work.videoId]?.title || work.title,
        client:
          work.client === "Lungnuad Production"
            ? youtubeMeta[work.videoId]?.author || work.client
            : work.client,
      })),
    [rawWorks, youtubeMeta]
  );
  const featured = works[0];
  const [watching, setWatching] = useState<PortfolioLibraryWork | null>(null);
  const watchingResolved = watching
    ? works.find((work) => work.videoId === watching.videoId) || watching
    : null;

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
              <a
                href={`/watch/${slug}/${featured.videoId}`}
                onClick={(event) => {
                  if (!window.matchMedia("(max-width: 767px)").matches) {
                    event.preventDefault();
                    setWatching(featured);
                  }
                }}
              >
                <Play fill="currentColor" /> Play
              </a>
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
                  <a
                    className="category-library-play"
                    href={`/watch/${slug}/${work.videoId}`}
                    onClick={(event) => {
                      if (!window.matchMedia("(max-width: 767px)").matches) {
                        event.preventDefault();
                        setWatching(work);
                      }
                    }}
                    aria-label={`Play ${work.title}`}
                  >
                    <Play fill="currentColor" />
                  </a>
                </div>

                <div className="category-library-copy">
                  {work.projectSlug ? (
                    <Link href={`/projects/${work.projectSlug}`}>{work.title}</Link>
                  ) : (
                    <a
                      className="portfolio-work-title-button"
                      href={`/watch/${slug}/${work.videoId}`}
                      onClick={(event) => {
                        if (!window.matchMedia("(max-width: 767px)").matches) {
                          event.preventDefault();
                          setWatching(work);
                        }
                      }}
                    >
                      {work.title}
                    </a>
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

      <PortfolioWatchPlayer
        current={watchingResolved}
        works={works}
        categoryTitle={category.title}
        onClose={() => setWatching(null)}
        onSelect={setWatching}
      />
    </div>
  );
}
