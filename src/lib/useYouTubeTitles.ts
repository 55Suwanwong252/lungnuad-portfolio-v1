"use client";

import { useEffect, useMemo, useState } from "react";

type YouTubeMeta = {
  title: string;
  author: string;
};

type MetaMap = Record<string, YouTubeMeta>;

const STORAGE_KEY = "lungnuad-youtube-meta-v1";
const BATCH_SIZE = 20;

function readSessionCache(): MetaMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MetaMap) : {};
  } catch {
    return {};
  }
}

function writeSessionCache(value: MetaMap) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Session storage can be unavailable in private browsing modes.
  }
}

export function useYouTubeTitles(videoIds: string[]) {
  const stableIds = useMemo(
    () => [...new Set(videoIds.filter(Boolean))],
    [videoIds.join("|")]
  );
  const [meta, setMeta] = useState<MetaMap>({});

  useEffect(() => {
    let cancelled = false;
    const cached = readSessionCache();
    setMeta((current) => ({ ...cached, ...current }));

    const missing = stableIds.filter((id) => !cached[id]);
    if (!missing.length) return () => { cancelled = true; };

    const batches: string[][] = [];
    for (let index = 0; index < missing.length; index += BATCH_SIZE) {
      batches.push(missing.slice(index, index + BATCH_SIZE));
    }

    Promise.all(
      batches.map(async (ids) => {
        try {
          const response = await fetch("/api/youtube-meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });

          if (!response.ok) return {};
          const data = (await response.json()) as { items?: MetaMap };
          return data.items || {};
        } catch {
          return {};
        }
      })
    ).then((results) => {
      if (cancelled) return;

      const merged = Object.assign({}, cached, ...results) as MetaMap;
      writeSessionCache(merged);
      setMeta((current) => ({ ...current, ...merged }));
    });

    return () => {
      cancelled = true;
    };
  }, [stableIds.join("|")]);

  return meta;
}
