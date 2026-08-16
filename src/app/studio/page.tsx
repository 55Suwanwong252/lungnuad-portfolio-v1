
"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Copy, Trash2, RotateCcw, Image as ImageIcon, Video, FileJson } from "lucide-react";
import initialContent from "@/content/content.json";

type Data = typeof initialContent;
type Project = Data["projects"][number];

const blankProject = (): Project => ({
  slug: `new-project-${Date.now()}`,
  title: "New Project",
  subtitle: "Subtitle",
  category: "Portfolio",
  client: "Client",
  year: new Date().getFullYear().toString(),
  description: "ใส่รายละเอียดโปรเจคตรงนี้",
  tags: ["Portfolio"],
  cover: "/media/projects/new-project/cover.jpg",
  vertical: "/media/projects/new-project/vertical.jpg",
  gallery: [],
  video: { type: "none", src: "" },
  featured: false,
});

export default function StudioPage() {
  const [data, setData] = useState<Data>(structuredClone(initialContent));
  const [selected, setSelected] = useState(0);
  const p = data.projects[selected];
  const [copied, setCopied] = useState(false);

  const jsonText = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const updateProject = (patch: Partial<Project>) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.projects[selected] = { ...next.projects[selected], ...patch };
      return next;
    });
  };

  const download = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "content.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonText);
    setCopied(true); setTimeout(()=>setCopied(false), 1500);
  };

  const addProject = () => {
    setData(prev => ({ ...prev, projects: [...prev.projects, blankProject()] as Data["projects"] }));
    setSelected(data.projects.length);
  };

  const removeProject = () => {
    if (data.projects.length <= 1) return;
    if (!confirm(`ลบ ${p.title}?`)) return;
    setData(prev => ({ ...prev, projects: prev.projects.filter((_,i)=>i!==selected) as Data["projects"] }));
    setSelected(Math.max(0, selected-1));
  };

  return (
    <div className="studio-page">
      <header className="studio-head">
        <div><span className="eyebrow">LOCAL CONTENT EDITOR</span><h1>Content Studio</h1><p>แก้ชื่อโปรเจค ภาพปก ภาพแนวตั้ง วิดีโอ Gallery และข้อความ โดยไม่ต้องแก้โค้ด React</p></div>
        <div className="studio-actions">
          <button onClick={()=>setData(structuredClone(initialContent))}><RotateCcw/>Reset</button>
          <button onClick={copyJson}><Copy/>{copied?"Copied":"Copy JSON"}</button>
          <button className="studio-primary" onClick={download}><Download/>Export content.json</button>
        </div>
      </header>

      <div className="studio-layout">
        <aside className="studio-projects">
          <div className="studio-side-title"><span>PROJECTS ({data.projects.length})</span><button onClick={addProject}><Plus/></button></div>
          {data.projects.map((item,i)=><button className={i===selected?"active":""} onClick={()=>setSelected(i)} key={`${item.slug}-${i}`}><b>{item.title}</b><span>{item.category}</span></button>)}
        </aside>

        <main className="studio-form">
          <div className="studio-preview" style={{backgroundImage:`url("${p.cover}")`}}>
            <div><span>Cover Preview</span><h2>{p.title}</h2><p>{p.subtitle}</p></div>
          </div>

          <section className="studio-section">
            <div className="studio-section-title"><FileJson/><div><b>ข้อมูลโปรเจค</b><span>แก้ข้อความและหมวดหมู่ได้ตรงนี้</span></div></div>
            <div className="studio-fields">
              <label>Title<input value={p.title} onChange={e=>updateProject({title:e.target.value})}/></label>
              <label>Subtitle<input value={p.subtitle} onChange={e=>updateProject({subtitle:e.target.value})}/></label>
              <label>Slug<input value={p.slug} onChange={e=>updateProject({slug:e.target.value})}/></label>
              <label>Client<input value={p.client} onChange={e=>updateProject({client:e.target.value})}/></label>
              <label>Category<input value={p.category} onChange={e=>updateProject({category:e.target.value})}/></label>
              <label>Year<input value={p.year} onChange={e=>updateProject({year:e.target.value})}/></label>
              <label className="wide">Description<textarea value={p.description} onChange={e=>updateProject({description:e.target.value})}/></label>
              <label className="wide">Tags (คั่นด้วย comma)<input value={p.tags.join(", ")} onChange={e=>updateProject({tags:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></label>
            </div>
          </section>

          <section className="studio-section">
            <div className="studio-section-title"><ImageIcon/><div><b>ภาพ</b><span>ใส่ URL หรือ path เช่น /media/projects/.../cover.jpg</span></div></div>
            <div className="studio-fields">
              <label className="wide">Cover image<input value={p.cover} onChange={e=>updateProject({cover:e.target.value})}/></label>
              <label className="wide">Vertical / Reel image<input value={p.vertical} onChange={e=>updateProject({vertical:e.target.value})}/></label>
              <label className="wide">Gallery — 1 รูปต่อ 1 บรรทัด<textarea value={p.gallery.join("\n")} onChange={e=>updateProject({gallery:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></label>
            </div>
          </section>

          <section className="studio-section">
            <div className="studio-section-title"><Video/><div><b>วิดีโอ</b><span>YouTube ใส่เฉพาะ Video ID / MP4 ใส่ path หรือ URL</span></div></div>
            <div className="studio-fields">
              <label>Video type
                <select value={p.video.type} onChange={e=>updateProject({video:{...p.video,type:e.target.value as Project["video"]["type"]}})}>
                  <option value="none">None</option><option value="youtube">YouTube</option><option value="mp4">MP4</option><option value="vimeo">Vimeo</option>
                </select>
              </label>
              <label>Video source<input value={p.video.src} onChange={e=>updateProject({video:{...p.video,src:e.target.value}})}/></label>
              <label className="studio-check"><input type="checkbox" checked={Boolean(p.featured)} onChange={e=>updateProject({featured:e.target.checked})}/> Featured on Home</label>
            </div>
          </section>

          <section className="studio-danger">
            <button onClick={removeProject}><Trash2/>Delete this project</button>
          </section>
        </main>
      </div>

      <footer className="studio-help">
        <b>หลังแก้เสร็จ:</b> กด <strong>Export content.json</strong> → เอาไฟล์ที่ได้ไปแทนที่ <code>src/content/content.json</code> → เว็บจะอัปเดตทันทีในเครื่อง และเมื่อ Push GitHub ก็จะ Deploy ขึ้น Vercel ต่อได้
      </footer>
    </div>
  );
}
