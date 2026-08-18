"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PortfolioWatchPlayer from "@/components/PortfolioWatchPlayer";
import {
  getPortfolioCategory,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import {
  portfolioVideosForCategory,
  type PortfolioLibraryWork,
} from "@/lib/portfolioVideoLibrary";
import { useYouTubeTitles } from "@/lib/useYouTubeTitles";

export default function PortfolioMobileWatchRoute({
  slug,
  videoId,
}: {
  slug: PortfolioCategorySlug;
  videoId: string;
}) {
  const router = useRouter();
  const category = getPortfolioCategory(slug);

  const rawWorks = useMemo(
    () => portfolioVideosForCategory(slug, []),
    [slug]
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

  const routeWork =
    works.find((work) => work.videoId === videoId) || works[0] || null;

  const [currentVideoId, setCurrentVideoId] = useState(
    routeWork?.videoId || videoId
  );

  const current =
    works.find((work) => work.videoId === currentVideoId) ||
    routeWork;

  function closePlayer() {
    router.push("/projects");
  }

  if (!current) return null;

  return (
    <PortfolioWatchPlayer
      current={current}
      works={works}
      categoryTitle={category.title}
      onClose={closePlayer}
      onSelect={(work: PortfolioLibraryWork) => setCurrentVideoId(work.videoId)}
      mode="inline"
    />
  );
}
