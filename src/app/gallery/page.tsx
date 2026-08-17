"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";

export default function GalleryPage() {
  const { cms } = useCms();
  const g = cms.galleryPage;
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const values = g.items.map((item) => item.caption?.trim()).filter(Boolean);
    return ["All", ...Array.from(new Set(values))].slice(0, 7);
  }, [g.items]);

  const items = filter === "All"
    ? g.items
    : g.items.filter((item) => item.caption === filter);

  return (
    <div className="gallery-page-clean">
      <section className="gallery-clean-head">
        <div>
          <span className="eyebrow">{g.eyebrow}</span>
          <h1>{g.title}</h1>
          <p>{g.description}</p>
        </div>
      </section>

      <div className="gallery-filter-bar" aria-label="Gallery filters">
        {categories.map((category) => (
          <button
            key={category}
            className={filter === category ? "active" : ""}
            onClick={() => setFilter(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <section className="gallery-clean-grid">
        {items.map((item, index) => {
          const card = (
            <>
              <div
                className="gallery-clean-media"
                style={{ backgroundImage: `url("${item.image}")` }}
              >
                <div className="gallery-clean-shade" />
                <span className="gallery-clean-number">{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="gallery-clean-arrow" />
              </div>
              <div className="gallery-clean-caption">
                <span>{item.caption}</span>
                <h3>{item.title}</h3>
              </div>
            </>
          );

          return item.projectSlug ? (
            <Link
              href={`/projects/${item.projectSlug}`}
              className="gallery-clean-card"
              key={item.id}
            >
              {card}
            </Link>
          ) : (
            <article className="gallery-clean-card" key={item.id}>
              {card}
            </article>
          );
        })}
      </section>
    </div>
  );
}
