"use client";

import Link from "next/link";
import {
  PORTFOLIO_CATEGORIES,
  portfolioCategoryPath,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";

export default function PortfolioCategoryNav({
  active,
}: {
  active?: PortfolioCategorySlug;
}) {
  return (
    <nav className="portfolio-category-nav" aria-label="ประเภทผลงาน">
      <Link className={!active ? "active" : ""} href="/projects">
        ทั้งหมด
      </Link>
      {PORTFOLIO_CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          className={active === category.slug ? "active" : ""}
          href={portfolioCategoryPath(category.slug)}
        >
          {category.title}
        </Link>
      ))}
    </nav>
  );
}
