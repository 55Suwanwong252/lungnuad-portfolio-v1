import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    const { put, list, del } = await import("@vercel/blob");

    const blob = await put(
      `cms/${Date.now()}-content.json`,
      JSON.stringify(content),
      { access: "public" },
    );

    // Keep only a few recent CMS snapshots to preserve Hobby storage.
    try {
      const all = await list({ prefix: "cms/", limit: 100 });
      const old = all.blobs
        .filter((item) => item.url !== blob.url)
        .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
        .slice(4);
      if (old.length) await del(old.map((item) => item.url));
    } catch {}

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 },
    );
  }
}
