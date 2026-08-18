"use client";

import { upload } from "@vercel/blob/client";
import {
  Check, ChevronDown, ChevronUp, ExternalLink, Film, FolderKanban, GalleryHorizontal,
  Globe2, Home, Image as ImageIcon, Info, LogOut, Mail, Monitor, Plus, RefreshCw,
  Save, Trash2, Upload, Video, X
} from "lucide-react";
import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { defaultCms, type CmsContent, type Project } from "@/lib/cms";

type Reel = { url: string; pathname?: string; title: string; source?: "local" | "blob" | string };
type Tab = "home" | "projects" | "reels" | "gallery" | "about" | "contact" | "global";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "reels", label: "Reels", icon: Film },
  { id: "gallery", label: "Gallery", icon: GalleryHorizontal },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "global", label: "Global", icon: Globe2 },
];

export default function Studio() {
  const [tab, setTab] = useState<Tab>("home");
  const [draft, setDraft] = useState<CmsContent>(defaultCms);
  const [saved, setSaved] = useState<CmsContent>(defaultCms);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [reels, setReels] = useState<Reel[]>([]);
  const [reelSource, setReelSource] = useState("");
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState(0);
  const [reelFile, setReelFile] = useState<File | null>(null);
  const [reelTitle, setReelTitle] = useState("");
  const [uploadingReel, setUploadingReel] = useState(false);
  const [mediaBusy, setMediaBusy] = useState("");
  const [previewReelUrl, setPreviewReelUrl] = useState("");

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const loadCms = async () => {
    const response = await fetch("/api/cms", { cache: "no-store" });
    const data = await response.json();
    const content = data?.content || defaultCms;
    setDraft(content);
    setSaved(content);
  };

  const loadReels = async () => {
    const response = await fetch("/api/reels", { cache: "no-store" });
    const data = await response.json();
    setReels(data?.reels || []);
    setReelSource(data?.source || "");
  };

  useEffect(() => {
    loadCms();
    loadReels();
  }, []);

  const saveAll = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const response = await fetch("/api/studio/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setSaved(structuredClone(draft));
      setSaveMessage("Saved · เว็บไซต์ออนไลน์จะอ่านข้อมูลใหม่นี้ทันที");
    } catch (error) {
      setSaveMessage(`Save ไม่สำเร็จ: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/studio/logout", { method: "POST" });
    location.href = "/studio/login";
  };

  const uploadMedia = async (file: File, folder: string) => {
    const extension = file.name.split(".").pop() || "bin";
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9ก-๙]+/gi, "-").replace(/^-|-$/g, "") || "media";
    return upload(`${folder}/${Date.now()}-${base}.${extension}`, file, {
      access: "public",
      handleUploadUrl: "/api/studio/upload-media",
    });
  };

  const patchHome = (patch: Partial<CmsContent["home"]>) =>
    setDraft((prev) => ({ ...prev, home: { ...prev.home, ...patch } }));

  const patchHomeReel = (patch: Partial<CmsContent["homeReel"]>) =>
    setDraft((prev) => ({ ...prev, homeReel: { ...prev.homeReel, ...patch } }));

  const patchProjectsPage = (patch: Partial<CmsContent["projectsPage"]>) =>
    setDraft((prev) => ({ ...prev, projectsPage: { ...prev.projectsPage, ...patch } }));

  const patchProject = (index: number, patch: Partial<Project>) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.projects[index] = { ...next.projects[index], ...patch };
      return next;
    });

  const addProject = () => {
    const next: Project = {
      slug: `project-${Date.now()}`, title: "New Project", subtitle: "Project subtitle",
      category: "Portfolio", client: "Client", year: new Date().getFullYear().toString(),
      description: "รายละเอียดโปรเจค", tags: ["Portfolio"], cover: draft.home.coverUrl,
      vertical: draft.home.coverUrl, gallery: [], video: { type: "none", src: "" }
    };
    setDraft((prev) => ({ ...prev, projects: [...prev.projects, next] }));
    setSelectedProject(draft.projects.length);
  };

  const deleteProject = (index: number) => {
    if (!confirm("ลบ Project นี้ออกจากเว็บไซต์?")) return;
    setDraft((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
    setSelectedProject(Math.max(0, index - 1));
  };

  const uploadReel = async () => {
    if (!reelFile) return;
    setUploadingReel(true);
    try {
      const title = reelTitle.trim() || reelFile.name.replace(/\.[^.]+$/, "");
      const extension = reelFile.name.split(".").pop() || "mp4";
      const safe = title.toLowerCase().replace(/[^a-z0-9ก-๙]+/gi, "-").replace(/^-|-$/g, "") || "reel";
      const blob = await upload(`reels/${Date.now()}-${safe}.${extension}`, reelFile, {
        access: "public",
        handleUploadUrl: "/api/studio/upload-reel",
        clientPayload: JSON.stringify({ title }),
      });

      setDraft((prev) => ({
        ...prev,
        reelMeta: { ...prev.reelMeta, [blob.url]: { title, caption: "Visual story", enabled: true } },
        reelOrder: [...prev.reelOrder, blob.url],
      }));
      setReelFile(null);
      setReelTitle("");
      await loadReels();
      setSaveMessage("Reel Upload สำเร็จ · กด Save เพื่อบันทึก Caption / Show on Home");
    } finally {
      setUploadingReel(false);
    }
  };

  const deleteReel = async (reel: Reel) => {
    if (reel.source === "local") return;
    if (!confirm(`ลบ ${reel.title}?`)) return;
    const response = await fetch("/api/studio/delete-reel", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: reel.url }),
    });
    if (response.ok) {
      setDraft((prev) => {
        const next = structuredClone(prev);
        delete next.reelMeta[reel.url];
        next.reelOrder = next.reelOrder.filter((url) => url !== reel.url);
        if (next.homeReel.selectedUrl === reel.url) next.homeReel.selectedUrl = "";
        return next;
      });
      await loadReels();
    }
  };

  const moveReel = (url: string, dir: -1 | 1) => {
    setDraft((prev) => {
      const order = prev.reelOrder.length ? [...prev.reelOrder] : reels.map((r) => r.url);
      const current = order.indexOf(url);
      const target = current + dir;
      if (current < 0 || target < 0 || target >= order.length) return prev;
      [order[current], order[target]] = [order[target], order[current]];
      return { ...prev, reelOrder: order };
    });
  };

  const currentProject = draft.projects[selectedProject];
  const currentGallery = draft.galleryPage.items[selectedGallery];

  return (
    <div className="cms-studio">
      <header className="cms-topbar">
        <div>
          <span>PRIVATE STUDIO · BUILD 10</span>
          <h1>Website Content Studio</h1>
          <p>Editor ซ้าย + Live Preview ขวา · Save แล้วเว็บออนไลน์เปลี่ยนทันที</p>
        </div>
        <div className="cms-top-actions">
          <a href="/" target="_blank" rel="noreferrer"><Monitor />Open Website</a>
          <button onClick={logout}><LogOut />Logout</button>
          <button className="cms-save" onClick={saveAll} disabled={!dirty || saving}>
            <Save />{saving ? "Saving..." : dirty ? "Save Changes" : "Saved"}
          </button>
        </div>
      </header>

      {saveMessage && <div className="cms-save-message">{saveMessage}</div>}

      <div className="cms-workspace">
        <aside className="cms-tabs">
          {tabs.map((item) => {
            const Icon = item.icon;
            return <button className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} key={item.id}><Icon />{item.label}</button>;
          })}
        </aside>

        <section className="cms-editor">
          {tab === "home" && (
            <div className="cms-panel">
              <PanelTitle title="Home" text="ข้อความ ภาพ Cover และ Hero ของหน้าแรก" />
              <Field label="Eyebrow" value={draft.home.heroEyebrow} onChange={(v) => patchHome({ heroEyebrow: v })} />
              <Field label="Headline" value={draft.home.heroTitle} onChange={(v) => patchHome({ heroTitle: v })} />
              <Field label="Headline ภาษาไทย" value={draft.home.heroTitleThai} onChange={(v) => patchHome({ heroTitleThai: v })} />
              <TextArea label="คำอธิบาย" value={draft.home.heroDescription} onChange={(v) => patchHome({ heroDescription: v })} />
              <div className="cms-two"><Field label="Primary CTA" value={draft.home.primaryCta} onChange={(v) => patchHome({ primaryCta: v })} /><Field label="Secondary CTA" value={draft.home.secondaryCta} onChange={(v) => patchHome({ secondaryCta: v })} /></div>

              <SectionLabel>Profile / Cover</SectionLabel>
              <MediaUpload
                label="Home Cover 16:9"
                value={draft.home.coverUrl}
                accept="image/*"
                busy={mediaBusy === "home-cover"}
                onUpload={async (file) => {
                  setMediaBusy("home-cover");
                  const blob = await uploadMedia(file, "home-cover");
                  patchHome({ coverUrl: blob.url });
                  setMediaBusy("");
                }}
                onUrl={(v) => patchHome({ coverUrl: v })}
              />
              <Field label="ชื่อโปรไฟล์" value={draft.home.profileName} onChange={(v) => patchHome({ profileName: v })} />
              <Field label="Role" value={draft.home.profileRole} onChange={(v) => patchHome({ profileRole: v })} />
              <Field label="Tagline" value={draft.home.profileTagline} onChange={(v) => patchHome({ profileTagline: v })} />
              <TextArea label="Profile description" value={draft.home.profileDescription} onChange={(v) => patchHome({ profileDescription: v })} />
              <Field label="Tags (comma)" value={draft.home.profileTags.join(", ")} onChange={(v) => patchHome({ profileTags: splitComma(v) })} />
              <div className="cms-two"><Field label="Experience" value={draft.home.experience} onChange={(v) => patchHome({ experience: v })} /><Field label="Location" value={draft.home.location} onChange={(v) => patchHome({ location: v })} /></div>
            </div>
          )}

          {tab === "projects" && currentProject && (
            <div className="cms-panel">
              <PanelTitle title="Projects" text="แก้ Profile ด้านบนและ Project แต่ละรายการ" />
              <SectionLabel>Projects Page Header</SectionLabel>
              <Field label="Profile Name" value={draft.projectsPage.profileName} onChange={(v) => patchProjectsPage({ profileName: v })} />
              <Field label="Tagline" value={draft.projectsPage.tagline} onChange={(v) => patchProjectsPage({ tagline: v })} />
              <TextArea label="Description" value={draft.projectsPage.description} onChange={(v) => patchProjectsPage({ description: v })} />
              <Field label="Tags (comma)" value={draft.projectsPage.tags.join(", ")} onChange={(v) => patchProjectsPage({ tags: splitComma(v) })} />
              <MediaUpload label="Projects Cover 16:9" value={draft.projectsPage.coverUrl} accept="image/*" busy={mediaBusy === "projects-cover"}
                onUpload={async(file)=>{setMediaBusy("projects-cover"); const b=await uploadMedia(file,"projects-cover"); patchProjectsPage({coverUrl:b.url}); setMediaBusy("");}}
                onUrl={(v)=>patchProjectsPage({coverUrl:v})}/>

              <SectionLabel>Project Library</SectionLabel>
              <div className="cms-select-row">
                <select value={selectedProject} onChange={(e) => setSelectedProject(Number(e.target.value))}>
                  {draft.projects.map((project, i) => <option value={i} key={`${project.slug}-${i}`}>{project.title}</option>)}
                </select>
                <button onClick={addProject}><Plus />Add</button>
                <button className="danger" onClick={() => deleteProject(selectedProject)}><Trash2 /></button>
              </div>

              <Field label="Title" value={currentProject.title} onChange={(v) => patchProject(selectedProject, { title: v })} />
              <Field label="Subtitle" value={currentProject.subtitle} onChange={(v) => patchProject(selectedProject, { subtitle: v })} />
              <div className="cms-two"><Field label="Client" value={currentProject.client} onChange={(v) => patchProject(selectedProject, { client: v })} /><Field label="Year" value={currentProject.year} onChange={(v) => patchProject(selectedProject, { year: v })} /></div>
              <Field label="Category" value={currentProject.category} onChange={(v) => patchProject(selectedProject, { category: v })} />
              <TextArea label="Description" value={currentProject.description} onChange={(v) => patchProject(selectedProject, { description: v })} />
              <Field label="Tags (comma)" value={currentProject.tags.join(", ")} onChange={(v) => patchProject(selectedProject, { tags: splitComma(v) })} />
              <MediaUpload label="Project Cover" value={currentProject.cover} accept="image/*" busy={mediaBusy === "project-cover"}
                onUpload={async(file)=>{setMediaBusy("project-cover"); const b=await uploadMedia(file,`projects/${currentProject.slug}`); patchProject(selectedProject,{cover:b.url}); setMediaBusy("");}}
                onUrl={(v)=>patchProject(selectedProject,{cover:v})}/>

              <SectionLabel>Project Video</SectionLabel>
              <label className="cms-field"><span>Video Type</span>
                <select value={currentProject.video.type} onChange={(e)=>patchProject(selectedProject,{video:{...currentProject.video,type:e.target.value as Project["video"]["type"]}})}>
                  <option value="none">None</option><option value="youtube">YouTube</option><option value="mp4">Uploaded MP4</option><option value="vimeo">Vimeo</option>
                </select>
              </label>
              <Field label={currentProject.video.type === "youtube" ? "YouTube URL หรือ Video ID (เล่นบนเว็บ)" : "Video URL / Source"} value={currentProject.video.src} onChange={(v)=>patchProject(selectedProject,{video:{...currentProject.video,src:youtubeId(v,currentProject.video.type)}})} />
              <MediaUpload label="หรือ Upload วิดีโอแนวนอน" value={currentProject.video.type === "mp4" ? currentProject.video.src : ""} accept="video/*" busy={mediaBusy === "project-video"}
                onUpload={async(file)=>{setMediaBusy("project-video"); const b=await uploadMedia(file,`project-videos/${currentProject.slug}`); patchProject(selectedProject,{video:{type:"mp4",src:b.url}}); setMediaBusy("");}}
                onUrl={(v)=>patchProject(selectedProject,{video:{type:"mp4",src:v}})}/>
            </div>
          )}

          {tab === "reels" && (
            <div className="cms-panel">
              <PanelTitle title="Reels" text="Upload, Caption, จัดลำดับ และเลือก Reel ที่โชว์หน้า Home" />
              <div className="cms-reel-upload">
                <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={(e)=>setReelFile(e.target.files?.[0] || null)} />
                <input placeholder="ชื่อ Reel" value={reelTitle} onChange={(e)=>setReelTitle(e.target.value)} />
                <button disabled={!reelFile || uploadingReel} onClick={uploadReel}><Upload />{uploadingReel ? "Uploading..." : "Upload Reel"}</button>
              </div>

              <SectionLabel>Home Reel Overlay</SectionLabel>
              <Field label="Eyebrow" value={draft.homeReel.eyebrow} onChange={(v)=>patchHomeReel({eyebrow:v})}/>
              <Field label="Headline (เว้นว่าง = ใช้ชื่อ Reel)" value={draft.homeReel.title} onChange={(v)=>patchHomeReel({title:v})}/>
              <TextArea label="Caption" value={draft.homeReel.caption} onChange={(v)=>patchHomeReel({caption:v})}/>
              <div className="cms-two"><Field label="CTA" value={draft.homeReel.ctaLabel} onChange={(v)=>patchHomeReel({ctaLabel:v})}/><Field label="Scroll Label" value={draft.homeReel.scrollLabel} onChange={(v)=>patchHomeReel({scrollLabel:v})}/></div>
              <div className="cms-check-row">
                <CheckField label="Show Sound" checked={draft.homeReel.showSound} onChange={(v)=>patchHomeReel({showSound:v})}/>
                <CheckField label="Show Share" checked={draft.homeReel.showShare} onChange={(v)=>patchHomeReel({showShare:v})}/>
                <CheckField label="Show CTA" checked={draft.homeReel.showCta} onChange={(v)=>patchHomeReel({showCta:v})}/>
              </div>
              <label className="cms-field"><span>Text Size</span><select value={draft.homeReel.textSize} onChange={(e)=>patchHomeReel({textSize:e.target.value as "small"|"medium"|"large"})}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
              <label className="cms-field"><span>Text Align</span><select value={draft.homeReel.textAlign} onChange={(e)=>patchHomeReel({textAlign:e.target.value as "left"|"center"})}><option value="left">Left</option><option value="center">Center</option></select></label>
              <label className="cms-field"><span>Text Color</span><select value={draft.homeReel.textColor} onChange={(e)=>patchHomeReel({textColor:e.target.value as "white"|"dark"})}><option value="white">White</option><option value="dark">Dark</option></select></label>
              <label className="cms-field"><span>Overlay {Math.round(draft.homeReel.overlayOpacity*100)}%</span><input type="range" min="0" max="0.85" step="0.05" value={draft.homeReel.overlayOpacity} onChange={(e)=>patchHomeReel({overlayOpacity:Number(e.target.value)})}/></label>

              <SectionLabel>Reel Library</SectionLabel>
              <div className="cms-reel-library">
                {reels.map((reel) => {
                  const meta = draft.reelMeta[reel.url] || { title: reel.title, caption: "", enabled: true };
                  const selected = draft.homeReel.selectedUrl === reel.url;
                  return (
                    <article key={reel.url} className={selected ? "home-selected" : ""}>
                      <video
                        src={`${reel.url}#t=0.8`}
                        muted
                        playsInline
                        preload="auto"
                        aria-label={`Preview ${meta.title || reel.title}`}
                        onLoadedMetadata={(e) => {
                          const video = e.currentTarget;
                          video.muted = true;
                          video.defaultMuted = true;
                          video.volume = 0;
                          if (Number.isFinite(video.duration) && video.duration > 0) {
                            const target = Math.min(0.8, Math.max(0, video.duration - 0.08));
                            if (Math.abs(video.currentTime - target) > 0.05) video.currentTime = target;
                          }
                        }}
                        onLoadedData={(e) => {
                          const video = e.currentTarget;
                          video.pause();
                          video.muted = true;
                        }}
                        onCanPlay={(e) => {
                          const video = e.currentTarget;
                          if (video.currentTime < 0.05 && Number.isFinite(video.duration) && video.duration > 0) {
                            video.currentTime = Math.min(0.8, Math.max(0, video.duration - 0.08));
                          }
                        }}
                        onMouseEnter={(e) => {
                          const video = e.currentTarget;
                          video.muted = true;
                          video.volume = 0;
                          void video.play().catch(() => undefined);
                        }}
                        onMouseLeave={(e) => {
                          const video = e.currentTarget;
                          video.pause();
                          if (Number.isFinite(video.duration) && video.duration > 0) {
                            video.currentTime = Math.min(0.8, Math.max(0, video.duration - 0.08));
                          }
                        }}
                        onClick={() => setPreviewReelUrl(reel.url)}
                      />
                      <div className="cms-reel-edit">
                        <div className="cms-reel-title-row"><b>{meta.title || reel.title}</b><div className="cms-source-badges"><span className={`source-${reel.source || "unknown"}`}>{(reel.source || "unknown").toUpperCase()}</span>{selected && <span><Check />Show on Home</span>}</div></div>
                        <input placeholder="Title" value={meta.title || ""} onChange={(e)=>setDraft(prev=>({...prev,reelMeta:{...prev.reelMeta,[reel.url]:{...meta,title:e.target.value}}}))}/>
                        <textarea placeholder="Caption" value={meta.caption || ""} onChange={(e)=>setDraft(prev=>({...prev,reelMeta:{...prev.reelMeta,[reel.url]:{...meta,caption:e.target.value}}}))}/>
                        <div className="cms-reel-buttons">
                          <button onClick={()=>patchHomeReel({selectedUrl:reel.url})}><Home />Show on Home</button>
                          <button onClick={()=>moveReel(reel.url,-1)}><ChevronUp /></button>
                          <button onClick={()=>moveReel(reel.url,1)}><ChevronDown /></button>
                          <a href={reel.url} target="_blank" rel="noreferrer"><ExternalLink /></a>
                          <button className="danger" disabled={reel.source==="local"} onClick={()=>deleteReel(reel)}><Trash2 /></button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div className="cms-panel">
              <PanelTitle title="Gallery" text="เพิ่มภาพ แก้ชื่อและ Caption" />
              <Field label="Eyebrow" value={draft.galleryPage.eyebrow} onChange={(v)=>setDraft(prev=>({...prev,galleryPage:{...prev.galleryPage,eyebrow:v}}))}/>
              <Field label="Title" value={draft.galleryPage.title} onChange={(v)=>setDraft(prev=>({...prev,galleryPage:{...prev.galleryPage,title:v}}))}/>
              <TextArea label="Description" value={draft.galleryPage.description} onChange={(v)=>setDraft(prev=>({...prev,galleryPage:{...prev.galleryPage,description:v}}))}/>

              <div className="cms-select-row">
                <select value={selectedGallery} onChange={(e)=>setSelectedGallery(Number(e.target.value))}>
                  {draft.galleryPage.items.map((item,i)=><option value={i} key={item.id}>{item.title}</option>)}
                </select>
                <button onClick={()=>{const item={id:`gallery-${Date.now()}`,image:draft.home.coverUrl,title:"New Image",caption:"Gallery",projectSlug:""}; setDraft(prev=>({...prev,galleryPage:{...prev.galleryPage,items:[...prev.galleryPage.items,item]}})); setSelectedGallery(draft.galleryPage.items.length);}}><Plus />Add</button>
                <button className="danger" onClick={()=>{setDraft(prev=>({...prev,galleryPage:{...prev.galleryPage,items:prev.galleryPage.items.filter((_,i)=>i!==selectedGallery)}}));setSelectedGallery(Math.max(0,selectedGallery-1));}}><Trash2 /></button>
              </div>
              {currentGallery && <>
                <Field label="Title" value={currentGallery.title} onChange={(v)=>patchGallery(setDraft,selectedGallery,{title:v})}/>
                <Field label="Caption" value={currentGallery.caption} onChange={(v)=>patchGallery(setDraft,selectedGallery,{caption:v})}/>
                <Field label="Project Slug (optional)" value={currentGallery.projectSlug || ""} onChange={(v)=>patchGallery(setDraft,selectedGallery,{projectSlug:v})}/>
                <MediaUpload label="Gallery Image" value={currentGallery.image} accept="image/*" busy={mediaBusy==="gallery-image"}
                  onUpload={async(file)=>{setMediaBusy("gallery-image");const b=await uploadMedia(file,"gallery");patchGallery(setDraft,selectedGallery,{image:b.url});setMediaBusy("");}}
                  onUrl={(v)=>patchGallery(setDraft,selectedGallery,{image:v})}/>
              </>}
            </div>
          )}

          {tab === "about" && (
            <div className="cms-panel">
              <PanelTitle title="About" text="แก้ข้อความหน้า About" />
              <Field label="Eyebrow" value={draft.aboutPage.eyebrow} onChange={(v)=>setDraft(prev=>({...prev,aboutPage:{...prev.aboutPage,eyebrow:v}}))}/>
              <Field label="Title" value={draft.aboutPage.title} onChange={(v)=>setDraft(prev=>({...prev,aboutPage:{...prev.aboutPage,title:v}}))}/>
              <TextArea label="Description" value={draft.aboutPage.description} onChange={(v)=>setDraft(prev=>({...prev,aboutPage:{...prev.aboutPage,description:v}}))}/>
              <Field label="CTA" value={draft.aboutPage.cta} onChange={(v)=>setDraft(prev=>({...prev,aboutPage:{...prev.aboutPage,cta:v}}))}/>
              {draft.aboutPage.stats.map((stat,i)=><div className="cms-two" key={i}><Field label={`Stat ${i+1}`} value={stat.value} onChange={(v)=>patchStat(setDraft,i,{value:v})}/><Field label="Label" value={stat.label} onChange={(v)=>patchStat(setDraft,i,{label:v})}/></div>)}
            </div>
          )}

          {tab === "contact" && (
            <div className="cms-panel">
              <PanelTitle title="Contact" text="แก้ข้อความและข้อมูลติดต่อ" />
              <Field label="Eyebrow" value={draft.contactPage.eyebrow} onChange={(v)=>setDraft(prev=>({...prev,contactPage:{...prev.contactPage,eyebrow:v}}))}/>
              <Field label="Title" value={draft.contactPage.title} onChange={(v)=>setDraft(prev=>({...prev,contactPage:{...prev.contactPage,title:v}}))}/>
              <TextArea label="Description" value={draft.contactPage.description} onChange={(v)=>setDraft(prev=>({...prev,contactPage:{...prev.contactPage,description:v}}))}/>
              <Field label="Email" value={draft.site.email} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,email:v}}))}/>
              <Field label="Facebook Label" value={draft.site.facebookLabel} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,facebookLabel:v}}))}/>
              <Field label="Facebook URL" value={draft.site.facebookUrl} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,facebookUrl:v}}))}/>
              <Field label="Service Area" value={draft.site.serviceArea} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,serviceArea:v}}))}/>
            </div>
          )}

          {tab === "global" && (
            <div className="cms-panel">
              <PanelTitle title="Global Settings" text="ชื่อแบรนด์และข้อความเมนู Mobile Liquid Navigation" />
              <Field label="Brand" value={draft.site.brand} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,brand:v}}))}/>
              <Field label="Tagline" value={draft.site.tagline} onChange={(v)=>setDraft(prev=>({...prev,site:{...prev.site,tagline:v}}))}/>
              <SectionLabel>Mobile Navigation Labels</SectionLabel>
              {(["home","reels","projects","gallery","more","about","contact"] as const).map((key)=><Field key={key} label={key} value={draft.navigation[key]} onChange={(v)=>setDraft(prev=>({...prev,navigation:{...prev.navigation,[key]:v}}))}/>)}
            </div>
          )}
        </section>

        <aside className="cms-preview">
          <div className="cms-preview-head"><div><span>LIVE PREVIEW</span><b>{tab.toUpperCase()}</b></div><span>{dirty ? "Unsaved changes" : "Saved"}</span></div>
          <LivePreview tab={tab} cms={draft} project={currentProject} gallery={currentGallery} reels={reels} previewReelUrl={previewReelUrl} />
        </aside>
      </div>
    </div>
  );
}

function PanelTitle({title,text}:{title:string;text:string}) {
  return <div className="cms-panel-title"><h2>{title}</h2><p>{text}</p></div>;
}
function SectionLabel({children}:{children:ReactNode}) { return <h3 className="cms-section-label">{children}</h3>; }
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return <label className="cms-field"><span>{label}</span><input value={value ?? ""} onChange={(e)=>onChange(e.target.value)}/></label>;
}
function TextArea({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return <label className="cms-field"><span>{label}</span><textarea value={value ?? ""} onChange={(e)=>onChange(e.target.value)}/></label>;
}
function CheckField({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return <label className="cms-check"><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/><span>{label}</span></label>;
}
function MediaUpload({label,value,accept,busy,onUpload,onUrl}:{label:string;value:string;accept:string;busy:boolean;onUpload:(f:File)=>Promise<void>;onUrl:(v:string)=>void}) {
  return <div className="cms-media-field"><span>{label}</span><input value={value || ""} onChange={(e)=>onUrl(e.target.value)} placeholder="URL หรือ upload ด้านล่าง"/><label className="cms-upload-mini"><input type="file" accept={accept} onChange={(e)=>{const f=e.target.files?.[0]; if(f) onUpload(f);}}/><Upload />{busy ? "Uploading..." : "Upload from Mac"}</label></div>;
}
function splitComma(v:string){return v.split(",").map(x=>x.trim()).filter(Boolean);}
function youtubeId(v:string,type:string){
  if(type!=="youtube") return v;
  const match=v.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || v;
}
function patchGallery(setDraft:Dispatch<SetStateAction<CmsContent>>,index:number,patch:Record<string,string>){
  setDraft(prev=>{const next=structuredClone(prev); next.galleryPage.items[index]={...next.galleryPage.items[index],...patch}; return next;});
}
function patchStat(setDraft:Dispatch<SetStateAction<CmsContent>>,index:number,patch:{value?:string;label?:string}){
  setDraft(prev=>{const next=structuredClone(prev); next.aboutPage.stats[index]={...next.aboutPage.stats[index],...patch}; return next;});
}

function LivePreview({tab,cms,project,gallery,reels,previewReelUrl}:{tab:Tab;cms:CmsContent;project?:Project;gallery?:CmsContent["galleryPage"]["items"][number];reels:Reel[];previewReelUrl?:string}) {
  if(tab==="home") return <div className="preview-home">
    <div className="preview-cover" style={{backgroundImage:`url("${cms.home.coverUrl}")`}} />
    <div className="preview-profile"><img src="/media/profile/lungnuad-profile.webp"/><div><small>{cms.home.profileRole}</small><h2>{cms.home.profileName}</h2><b>{cms.home.profileTagline}</b><p>{cms.home.profileDescription}</p></div></div>
    <div className="preview-hero"><span>{cms.home.heroEyebrow}</span><h1>{cms.home.heroTitle}<br/>{cms.home.heroTitleThai}</h1><p>{cms.home.heroDescription}</p><button>{cms.home.primaryCta}</button></div>
  </div>;

  if(tab==="projects" && project) return <div className="preview-projects">
    <div className="preview-wide-cover" style={{backgroundImage:`url("${cms.projectsPage.coverUrl}")`}}/>
    <h1>{cms.projectsPage.profileName}</h1><p>{cms.projectsPage.description}</p>
    <div className="preview-project-card"><div style={{backgroundImage:`url("${project.cover}")`}}/><span>{project.category}</span><h2>{project.title}</h2><p>{project.subtitle}</p></div>
  </div>;

  if(tab==="reels") {
    const selected=reels.find(r=>r.url===previewReelUrl)||reels.find(r=>r.url===cms.homeReel.selectedUrl)||reels[0];
    const meta=selected ? cms.reelMeta[selected.url] : undefined;
    return <div className="preview-phone">{selected ? <><video src={selected.url} autoPlay loop muted playsInline/><div className="preview-reel-overlay" style={{opacity:cms.homeReel.overlayOpacity}}/><div className={`preview-reel-copy ${cms.homeReel.textAlign}`}><span>{cms.homeReel.eyebrow}</span><h2>{cms.homeReel.title||meta?.title||selected.title}</h2><p>{cms.homeReel.caption}</p>{cms.homeReel.showCta&&<b>{cms.homeReel.ctaLabel}</b>}</div></>:<p>No reel</p>}</div>;
  }

  if(tab==="gallery" && gallery) return <div className="preview-simple"><span>{cms.galleryPage.eyebrow}</span><h1>{cms.galleryPage.title}</h1><p>{cms.galleryPage.description}</p><div className="preview-gallery-image" style={{backgroundImage:`url("${gallery.image}")`}}><b>{gallery.title}</b><small>{gallery.caption}</small></div></div>;
  if(tab==="about") return <div className="preview-simple"><span>{cms.aboutPage.eyebrow}</span><h1>{cms.aboutPage.title}</h1><p>{cms.aboutPage.description}</p></div>;
  if(tab==="contact") return <div className="preview-simple"><span>{cms.contactPage.eyebrow}</span><h1>{cms.contactPage.title}</h1><p>{cms.contactPage.description}</p><b>{cms.site.email}</b></div>;
  return <div className="preview-simple"><span>GLOBAL</span><h1>{cms.site.brand}</h1><p>{cms.site.tagline}</p><div className="preview-liquid">Home · ผลงาน · Gallery</div></div>;
}
