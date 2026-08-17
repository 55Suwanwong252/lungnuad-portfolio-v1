import { NextResponse } from "next/server";

const localReels = [
  { url: "/media/reels/reel-01.mp4", title: "Reel 01", source: "local" },
  { url: "/media/reels/reel-02.mp4", title: "Reel 02", source: "local" },
  { url: "/media/reels/reel-03.mp4", title: "Reel 03", source: "local" },
];

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: "reels/", limit: 100 });

    const blobReels = result.blobs
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

    // Build 10.1: Blob never replaces the bundled reels.
    // Return both sources so the original reels remain visible after Blob is connected.
    const seen = new Set<string>();
    const reels = [...blobReels, ...localReels].filter((reel) => {
      if (seen.has(reel.url)) return false;
      seen.add(reel.url);
      return true;
    });

    return NextResponse.json({
      reels,
      source: blobReels.length ? "mixed" : "local",
      counts: { blob: blobReels.length, local: localReels.length },
    });
  } catch {
    return NextResponse.json({
      reels: localReels,
      source: "local",
      counts: { blob: 0, local: localReels.length },
    });
  }
}
