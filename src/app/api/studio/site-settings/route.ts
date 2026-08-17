import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const homeCoverUrl = String(body?.homeCoverUrl || "").trim();

    if (!homeCoverUrl) {
      return NextResponse.json({ error: "Missing cover URL" }, { status: 400 });
    }

    const settings = {
      homeCoverUrl,
      updatedAt: new Date().toISOString(),
    };

    const { put } = await import("@vercel/blob");
    const blob = await put(
      `site-settings/${Date.now()}-site.json`,
      JSON.stringify(settings),
      { access: "public" },
    );

    return NextResponse.json({ ok: true, settings, blobUrl: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save settings failed" },
      { status: 500 },
    );
  }
}
