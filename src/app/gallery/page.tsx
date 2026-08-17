"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCms } from "@/components/CmsProvider";

export default function GalleryPage() {
  const { cms } = useCms();
  const g = cms.galleryPage;
  return (
    <div className="page-wrap">
      <section className="page-heading">
        <div><span className="eyebrow">{g.eyebrow}</span><h1>{g.title}</h1><p>{g.description}</p></div>
      </section>
      <div className="masonry-gallery">
        {g.items.map((item, i) => {
          const body = (
            <div><span>{item.caption}</span><h3>{item.title}</h3><ArrowUpRight /></div>
          );
          if (item.projectSlug) {
            return <Link href={`/projects/${item.projectSlug}`} key={item.id} className={`gallery-tile tile-${i%4}`} style={{backgroundImage:`url("${item.image}")`}}>{body}</Link>;
          }
          return <div key={item.id} className={`gallery-tile tile-${i%4}`} style={{backgroundImage:`url("${item.image}")`}}>{body}</div>;
        })}
      </div>
    </div>
  );
}
