import { NextResponse } from "next/server";

const fallback = [
  { url: "/media/reels/reel-01.mp4", title: "Reel 01", source: "local" },
  { url: "/media/reels/reel-02.mp4", title: "Reel 02", source: "local" },
  { url: "/media/reels/reel-03.mp4", title: "Reel 03", source: "local" },
];

export async function GET() {
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: "reels/", limit: 100 });

    const reels = result.blobs
      .filter((blob) => /\.(mp4|mov|webm|m4v)$/i.test(blob.pathname))
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        title:
          blob.pathname
            .split("/")
            .pop()
            ?.replace(/^\d+-/, "")
            .replace(/\.[^.]+$/, "")
            .replace(/-/g, " ") || "Reel",
        uploadedAt: blob.uploadedAt,
        source: "blob",
      }));

    // If Blob exists, return its real state, even when it contains zero reels.
    return NextResponse.json({ reels, source: "blob" });
  } catch {
    // Only use local demo reels when Blob has not been configured / is unavailable.
    return NextResponse.json({ reels: fallback, source: "fallback" });
  }
}
