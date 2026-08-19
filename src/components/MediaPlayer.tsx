"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/cms";
import { youtubeVideoId } from "@/lib/youtube";

export default function MediaPlayer({ project }: { project: Project }) {
  const { video } = project;
  const [playing, setPlaying] = useState(false);
  const youtubeId = video?.type === "youtube" ? youtubeVideoId(video.src) : "";

  if (video?.type === "youtube" && youtubeId) {
    return (
      <div className="media-player media-player-clean">
        {!playing ? (
          <button
            className="media-poster-button"
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${project.title}`}
            style={{ backgroundImage: `url("${project.cover}")` }}
          >
            <span className="media-poster-shade" />
            <span className="media-poster-play"><Play fill="currentColor" /></span>
            <span className="media-poster-label">
              <small>{project.category}</small>
              <b>{project.title}</b>
            </span>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&playsinline=1&rel=0&controls=1`}
            title={`${project.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  if (video?.type === "vimeo" && video.src) {
    return (
      <div className="media-player">
        <iframe
          src={`https://player.vimeo.com/video/${video.src}`}
          title={`${project.title} video`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (video?.type === "mp4" && video.src) {
    return (
      <div className="media-player">
        <video controls playsInline poster={project.cover}>
          <source src={video.src} />
        </video>
      </div>
    );
  }

  return (
    <div className="media-player media-empty" style={{ backgroundImage: `url("${project.cover}")` }}>
      <div><Play size={24} /><span>VIDEO COMING SOON</span></div>
    </div>
  );
}
