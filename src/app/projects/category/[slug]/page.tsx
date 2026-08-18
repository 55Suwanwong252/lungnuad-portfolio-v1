import { notFound } from "next/navigation";
import PortfolioCategoryLibrary from "@/components/PortfolioCategoryLibrary";
import {
  PORTFOLIO_CATEGORIES,
  isPortfolioCategorySlug,
} from "@/lib/portfolioCategories";

export function generateStaticParams() {
  return PORTFOLIO_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export default async function PortfolioCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isPortfolioCategorySlug(slug)) notFound();

  return <PortfolioCategoryLibrary slug={slug} />;
}
