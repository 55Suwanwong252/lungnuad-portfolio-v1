import { NextResponse } from "next/server";
import { defaultCms } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: "cms/", limit: 100 });

    const latest = result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];

    if (latest) {
      const response = await fetch(latest.url, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to read CMS content");
      const content = await response.json();
      return NextResponse.json({ content, source: "blob", updatedAt: latest.uploadedAt });
    }

    // Build 08 compatibility: inherit the last saved Home Cover once.
    const compatibility = structuredClone(defaultCms);
    try {
      const oldSettings = await list({ prefix: "site-settings/", limit: 100 });
      const lastSetting = oldSettings.blobs
        .filter((blob) => blob.pathname.endsWith(".json"))
        .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
      if (lastSetting) {
        const response = await fetch(lastSetting.url, { cache: "no-store" });
        const data = await response.json();
        if (data?.homeCoverUrl) compatibility.home.coverUrl = data.homeCoverUrl;
      }
    } catch {}

    return NextResponse.json({ content: compatibility, source: "default" });
  } catch {
    return NextResponse.json({ content: defaultCms, source: "default" });
  }
}
