import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const url = String(body?.url || "");

    if (!url) {
      return NextResponse.json({ error: "Missing Reel URL" }, { status: 400 });
    }

    const { del } = await import("@vercel/blob");
    await del(url);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
