"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Film,
  LogOut,
  RefreshCw,
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

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.href = "/studio/login";
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
          <h1>Reel Manager</h1>
          <p>เพิ่มหรือลบ Reel ได้อิสระ คลิปใน Vercel Blob คือรายการที่แสดงจริงบนหน้า Reels</p>
        </div>
        <button className="studio-logout" onClick={logout}><LogOut /> Logout</button>
      </header>

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
          <span>
            {file
              ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
              : "Click to browse"}
          </span>
        </label>

        <input
          className="studio-title-input"
          placeholder="ชื่อ Reel"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button
          className="studio-upload-btn"
          disabled={!file || uploading}
          onClick={doUpload}
        >
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
          <div className="studio-empty">
            ยังไม่มี Reel — อัปโหลดคลิปด้านบนเพื่อเริ่มหน้า Reels
          </div>
        ) : (
          <div className="studio-reel-grid">
            {reels.map((reel) => (
              <article key={reel.url}>
                <video src={reel.url} muted playsInline preload="metadata" />
                <div className="studio-reel-item-footer">
                  <div>
                    <b>{reel.title}</b>
                    <small>{reel.source === "local" ? "Demo clip" : "Vercel Blob"}</small>
                  </div>
                  <div className="studio-reel-item-actions">
                    <a href={reel.url} target="_blank" rel="noreferrer" aria-label="Open video">
                      <ExternalLink />
                    </a>
                    <button
                      onClick={() => remove(reel)}
                      disabled={deleting === reel.url || source === "fallback"}
                      aria-label="Delete Reel"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="blob-note">
        <b>วิธีทำให้เหลือคลิปเดียว:</b> เมื่อ Vercel Blob เชื่อมแล้ว ให้ลบคลิปอื่นใน Reel Library เหลือเพียงคลิปที่ต้องการ หน้า Home บนมือถือและหน้า Reels จะใช้รายการเดียวกันโดยอัตโนมัติ
      </aside>
    </div>
  );
}
