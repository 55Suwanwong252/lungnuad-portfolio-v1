"use client";

import Link from "next/link";
import { ArrowRight, Play, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/cms";
import { youtubeVideoId } from "@/lib/youtube";

type Props = {
  projects: Project[];
  compact?: boolean;
  showFilters?: boolean;
};

function groupFor(project: Project) {
  const hay = `${project.category} ${project.tags.join(" ")}`.toLowerCase();
  if (hay.includes("wedding")) return "Wedding";
  if (hay.includes("education") || hay.includes("university")) return "Education";
  if (hay.includes("corporate")) return "Corporate";
  if (hay.includes("event") || hay.includes("sport")) return "Event";
  if (hay.includes("behind") || hay.includes("bts")) return "BTS";
  if (hay.includes("commercial") || hay.includes("tvc") || hay.includes("โฆษณา")) return "Commercial";
  if (hay.includes("pr")) return "PR";
  return "Other";
}

function youtubeThumb(project: Project) {
  if (project.video?.type === "youtube" && project.video.src) {
    return project.cover || `https://img.youtube.com/vi/${youtubeVideoId(project.video.src)}/maxresdefault.jpg`;
  }
  return project.cover;
}

export default function SocialWorkFeed({ projects, compact = false, showFilters = true }: Props) {
  const [filter, setFilter] = useState("For You");
  const [watching, setWatching] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const order = ["Commercial", "Wedding", "Corporate", "Education", "Event", "PR", "BTS", "Other"];
    const found = new Set<string>(projects.map(groupFor));
    return ["For You", ...order.filter((item) => found.has(item))];
  }, [projects]);

  const visible = filter === "For You"
    ? projects
    : projects.filter((project) => groupFor(project) === filter);

  return (
    <>
      {showFilters && (
        <div className="social-filter-rail" aria-label="Portfolio categories">
          {categories.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className={`social-work-feed ${compact ? "compact" : ""}`}>
        {visible.map((project, index) => {
          const playable =
            project.video?.type === "youtube" &&
            Boolean(youtubeVideoId(project.video.src));
          const feature = !compact && filter === "For You" && index === 0;

          return (
            <article
              key={project.slug}
              className={`social-work-card ${feature ? "social-feature-card" : ""}`}
            >
              <div
                className="social-work-media"
                style={{ backgroundImage: `url("${youtubeThumb(project)}")` }}
              >
                <div className="social-work-shade" />
                {playable ? (
                  <button
                    className="social-play-button"
                    type="button"
                    aria-label={`Play ${project.title}`}
                    onClick={() => setWatching(project)}
                  >
                    <Play fill="currentColor" />
                  </button>
                ) : (
                  <Link className="social-play-button" href={`/projects/${project.slug}`} aria-label={`Open ${project.title}`}>
                    <ArrowRight />
                  </Link>
                )}
                <span className="social-media-index">{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="social-work-body">
                <div className="social-work-copy">
                  <span>{groupFor(project)} · {project.year}</span>
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                </div>
                <Link href={`/projects/${project.slug}`} className="social-project-link">
                  Project <ArrowRight />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {watching?.video?.type === "youtube" && youtubeVideoId(watching.video.src) && (
        <div className="watch-modal" role="dialog" aria-modal="true" aria-label={`${watching.title} video`}>
          <button className="watch-modal-close" type="button" onClick={() => setWatching(null)} aria-label="Close video">
            <X />
          </button>

          <div className="watch-modal-shell">
            <div className="watch-modal-player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId(watching.video.src)}?autoplay=1&playsinline=1&rel=0&controls=1`}
                title={`${watching.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="watch-modal-info">
              <span>{groupFor(watching)} · {watching.year}</span>
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
