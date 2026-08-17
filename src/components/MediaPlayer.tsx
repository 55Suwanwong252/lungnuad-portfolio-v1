
import { Play } from "lucide-react";
import type { Project } from "@/lib/cms";

export default function MediaPlayer({ project }: { project: Project }) {
  const { video } = project;

  if (video?.type === "youtube" && video.src) {
    return (
      <div className="media-player">
        <iframe
          src={`https://www.youtube.com/embed/${video.src}?rel=0&modestbranding=1`}
          title={`${project.title} video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
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
      <div><Play size={24} /><span>เพิ่ม Video URL ได้จาก Content Studio</span></div>
    </div>
  );
}
