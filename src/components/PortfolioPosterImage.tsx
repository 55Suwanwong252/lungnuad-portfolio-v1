"use client";

import { useEffect, useMemo, useState } from "react";

export default function PortfolioPosterImage({
  src,
  videoId,
  alt,
  eager = false,
}: {
  src: string;
  videoId: string;
  alt: string;
  eager?: boolean;
}) {
  const fallback = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId]
  );
  const [resolvedSrc, setResolvedSrc] = useState(src || fallback);

  useEffect(() => {
    setResolvedSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      className="portfolio-poster-img"
      src={resolvedSrc}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (resolvedSrc !== fallback) setResolvedSrc(fallback);
      }}
    />
  );
}
