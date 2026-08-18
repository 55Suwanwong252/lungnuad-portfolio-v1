import { notFound } from "next/navigation";
import PortfolioMobileWatchRoute from "@/components/PortfolioMobileWatchRoute";
import { isPortfolioCategorySlug } from "@/lib/portfolioCategories";
import { CURATED_PORTFOLIO_LIBRARY } from "@/lib/portfolioVideoLibrary";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ category: string; videoId: string }>;
}) {
  const { category, videoId } = await params;

  if (!isPortfolioCategorySlug(category)) notFound();

  const exists = CURATED_PORTFOLIO_LIBRARY.some(
    (entry) => entry.category === category && entry.videoId === videoId
  );

  if (!exists) notFound();

  return <PortfolioMobileWatchRoute slug={category} videoId={videoId} />;
}
