import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: "site-settings/", limit: 100 });

    const latest = result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];

    if (!latest) {
      return NextResponse.json({ settings: {}, source: "default" });
    }

    const response = await fetch(latest.url, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to read site settings");

    const settings = await response.json();
    return NextResponse.json({ settings, source: "blob" });
  } catch {
    return NextResponse.json({ settings: {}, source: "default" });
  }
}
