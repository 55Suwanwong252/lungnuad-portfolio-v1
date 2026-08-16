
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";

export default function GalleryPage() {
  return (
    <div className="page-wrap">
      <section className="page-heading"><div><span className="eyebrow">Visual archive</span><h1>Gallery</h1><p>Contact sheet สำหรับสำรวจงานแบบเร็ว คลิกภาพเพื่อเข้า Project เต็มได้ทันที</p></div></section>
      <div className="masonry-gallery">
        {projects.map((p,i)=><Link href={`/projects/${p.slug}`} key={p.slug} className={`gallery-tile tile-${i%4}`} style={{backgroundImage:`url("${p.cover}")`}}>
          <div><span>{p.category}</span><h3>{p.title}</h3><ArrowUpRight/></div>
        </Link>)}
      </div>
    </div>
  );
}
