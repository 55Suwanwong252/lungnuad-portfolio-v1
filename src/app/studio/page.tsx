"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Film,
  Image as ImageIcon,
  LogOut,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type Reel = {
  url: string;
  pathname?: string;
  title: string;
  source?: string;
};

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [message, setMessage] = useState("");
  const [reels, setReels] = useState<Reel[]>([]);
  const [source, setSource] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [savedCover, setSavedCover] = useState("");
  const [coverRatio, setCoverRatio] = useState("");
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");

  const load = () =>
    fetch("/api/reels", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setReels(data.reels || []);
        setSource(data.source || "");
      })
      .catch(() => {
        setReels([]);
        setSource("");
      });

  const loadCover = () =>
    fetch("/api/site-settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const url = data?.settings?.homeCoverUrl || "";
        setSavedCover(url);
        if (url) setCoverPreview(url);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    loadCover();
  }, []);

  const logout = async () => {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.href = "/studio/login";
  };

  const selectCover = (selected: File | null) => {
    setCoverFile(selected);
    setCoverRatio("");
    setCoverMessage("");

    if (!selected) {
      setCoverPreview(savedCover);
      return;
    }

    const preview = URL.createObjectURL(selected);
    setCoverPreview(preview);

    const image = new Image();
    image.onload = () => {
      const ratio = image.width / image.height;
      setCoverRatio(
        `${image.width}×${image.height} · ${ratio >= 1.72 && ratio <= 1.82 ? "16:9 ดีมาก" : "แนะนำ 16:9"}`
      );
      URL.revokeObjectURL(preview);
    };
    image.src = preview;
  };

  const saveCover = async () => {
    if (!coverFile) return;
    setCoverBusy(true);
    setCoverMessage("");

    try {
      const extension = coverFile.name.split(".").pop() || "jpg";
      const blob = await upload(
        `site-cover/${Date.now()}-home-cover.${extension}`,
        coverFile,
        {
          access: "public",
          handleUploadUrl: "/api/studio/upload-image",
        },
      );

      const response = await fetch("/api/studio/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeCoverUrl: blob.url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");

      setSavedCover(blob.url);
      setCoverPreview(blob.url);
      setCoverFile(null);
      setCoverMessage("บันทึกภาพ Cover สำเร็จ — หน้า Home จะใช้ภาพนี้ทันที");
    } catch (error) {
      setCoverMessage(
        `บันทึก Cover ไม่สำเร็จ: ${error instanceof Error ? error.message : "ตรวจสอบ Vercel Blob"}`
      );
    } finally {
      setCoverBusy(false);
    }
  };

  const doUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    try {
      const reelTitle = title.trim() || file.name.replace(/\.[^.]+$/, "");
      const extension = file.name.split(".").pop() || "mp4";
      const safeTitle =
        reelTitle
          .toLowerCase()
          .replace(/[^a-z0-9ก-๙]+/gi, "-")
          .replace(/^-|-$/g, "") || "reel";

      await upload(`reels/${Date.now()}-${safeTitle}.${extension}`, file, {
        access: "public",
        handleUploadUrl: "/api/studio/upload-reel",
        clientPayload: JSON.stringify({ title: reelTitle }),
      });

      setMessage("อัปโหลด Reel สำเร็จ");
      setFile(null);
      setTitle("");
      await load();
    } catch (error) {
      setMessage(
        `Upload ไม่สำเร็จ: ${error instanceof Error ? error.message : "ตรวจสอบ Vercel Blob"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  const remove = async (reel: Reel) => {
    if (reel.source === "local" || source === "fallback") {
      setMessage("คลิปตัวอย่างในโปรเจกต์ลบจากออนไลน์ไม่ได้ — เมื่อสร้าง Blob แล้ว ระบบจะใช้คลิปใน Blob แทน");
      return;
    }

    if (!confirm(`ลบ "${reel.title}" ออกจาก Reels ใช่หรือไม่?`)) return;

    setDeleting(reel.url);
    setMessage("");

    try {
      const response = await fetch("/api/studio/delete-reel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: reel.url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed");

      setMessage("ลบ Reel เรียบร้อย");
      await load();
    } catch (error) {
      setMessage(`ลบไม่สำเร็จ: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className="studio-light">
      <header className="studio-manager-head">
        <div>
          <span>STUDIO</span>
          <h1>Content Manager</h1>
          <p>เปลี่ยนภาพ Cover หน้า Home และจัดการ Reel จากหน้าเดียว</p>
        </div>
        <button className="studio-logout" onClick={logout}><LogOut /> Logout</button>
      </header>

      <section className="cover-manager-card">
        <div className="studio-module-title">
          <div className="upload-icon"><ImageIcon /></div>
          <div>
            <h2>Home Cover</h2>
            <p>ภาพหน้าปกขนาดใหญ่แบบในตัวอย่าง · แนะนำ 16:9 · JPG/PNG/WebP</p>
          </div>
        </div>

        <div
          className="cover-manager-preview"
          style={coverPreview ? { backgroundImage: `url("${coverPreview}")` } : undefined}
        >
          {!coverPreview && <span>ยังไม่มีภาพ Cover</span>}
          <div className="cover-preview-label">HOME COVER PREVIEW · 16:9</div>
        </div>

        <label className="upload-drop cover-upload-drop">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => selectCover(event.target.files?.[0] || null)}
          />
          <Upload />
          <b>{coverFile ? coverFile.name : "เลือกหรือเปลี่ยนภาพ Cover"}</b>
          <span>{coverFile ? `${(coverFile.size / 1024 / 1024).toFixed(1)} MB · ${coverRatio || "กำลังตรวจสอบ..."}` : "Click to browse"}</span>
        </label>

        <button className="studio-upload-btn cover-save-btn" disabled={!coverFile || coverBusy} onClick={saveCover}>
          <Save /> {coverBusy ? "Saving Cover..." : "Save Home Cover"}
        </button>

        {coverMessage && <p className="studio-msg">{coverMessage}</p>}
      </section>

      <section className="upload-card">
        <div className="upload-icon"><Film /></div>
        <div>
          <h2>Upload Reel Video</h2>
          <p>แนะนำ 9:16 · MP4/H.264 · 1080×1920 หรือ 720×1280</p>
        </div>

        <label className="upload-drop">
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <Upload />
          <b>{file ? file.name : "เลือกไฟล์วิดีโอ"}</b>
          <span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "Click to browse"}</span>
        </label>

        <input className="studio-title-input" placeholder="ชื่อ Reel" value={title} onChange={(event) => setTitle(event.target.value)} />

        <button className="studio-upload-btn" disabled={!file || uploading} onClick={doUpload}>
          {uploading ? "Uploading..." : "Upload to Reels"}
        </button>

        {message && <p className="studio-msg">{message}</p>}
      </section>

      <section className="studio-reel-list">
        <div className="studio-list-head">
          <div>
            <h2>Reel Library</h2>
            <span className="studio-count">{reels.length} clips · {source === "blob" ? "Vercel Blob" : "Local demo"}</span>
          </div>
          <button onClick={load}><RefreshCw /> Refresh</button>
        </div>

        {reels.length === 0 ? (
          <div className="studio-empty">ยังไม่มี Reel — อัปโหลดคลิปด้านบนเพื่อเริ่มหน้า Reels</div>
        ) : (
          <div className="studio-reel-grid">
            {reels.map((reel) => (
              <article key={reel.url}>
                <video src={reel.url} muted playsInline preload="metadata" />
                <div className="studio-reel-item-footer">
                  <div><b>{reel.title}</b><small>{reel.source === "local" ? "Demo clip" : "Vercel Blob"}</small></div>
                  <div className="studio-reel-item-actions">
                    <a href={reel.url} target="_blank" rel="noreferrer" aria-label="Open video"><ExternalLink /></a>
                    <button onClick={() => remove(reel)} disabled={deleting === reel.url || source === "fallback"} aria-label="Delete Reel"><Trash2 /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
