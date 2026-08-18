import { NextResponse } from "next/server";

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const MAX_IDS = 25;

type MetaResult = {
  title?: string;
  author_name?: string;
};

async function fetchYouTubeMeta(id: string) {
  const url =
    "https://www.youtube.com/oembed?format=json&url=" +
    encodeURIComponent(`https://www.youtube.com/watch?v=${id}`);

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 },
    headers: { "User-Agent": "LungnuadPortfolio/1.0" },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as MetaResult;
  if (!data.title) return null;

  return {
    title: data.title.trim(),
    author: data.author_name?.trim() || "Lungnuad Production",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { ids?: unknown };
    const ids = Array.isArray(body.ids)
      ? [...new Set(body.ids.filter((id): id is string => typeof id === "string" && VIDEO_ID.test(id)))].slice(0, MAX_IDS)
      : [];

    if (!ids.length) {
      return NextResponse.json({ items: {} });
    }

    const settled = await Promise.allSettled(
      ids.map(async (id) => [id, await fetchYouTubeMeta(id)] as const)
    );

    const items: Record<string, { title: string; author: string }> = {};

    for (const result of settled) {
      if (result.status !== "fulfilled") continue;
      const [id, meta] = result.value;
      if (meta) items[id] = meta;
    }

    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return NextResponse.json({ items: {} }, { status: 200 });
  }
}
