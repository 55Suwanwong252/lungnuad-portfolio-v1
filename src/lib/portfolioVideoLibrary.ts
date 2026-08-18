import type { Project } from "@/lib/cms";
import {
  getPortfolioCategory,
  type PortfolioCategorySlug,
} from "@/lib/portfolioCategories";
import { youtubeVideoId } from "@/lib/youtube";

export type PortfolioVideoEntry = {
  id: string;
  videoId: string;
  category: PortfolioCategorySlug;
  order: number;
};

export type PortfolioLibraryWork = {
  id: string;
  videoId: string;
  category: PortfolioCategorySlug;
  order: number;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  cover: string;
  projectSlug?: string;
};

const CURATED_IDS: Record<PortfolioCategorySlug, string[]> = {
  "commercial": [
    "OL4r_CtyyO4",
    "GkcQNj3-6nM",
    "2ZJ_qtu-TKI",
    "avfjjWGxHTQ",
    "bEL-HWG4ha0",
    "Dku2_5xvJos",
    "uuUGWtAQ-CY",
    "LaVPBfaRF0I",
    "K5hHiJgyYh0",
    "NZfPY19avc0",
    "L0hqxKJHFGY",
    "x8-8UXnIIB8"
  ],
  "wedding": [
    "WnMkJjR1d5Q",
    "VMZgYfxovQI",
    "zf3l8Iiv8uQ",
    "2b_huNx6eO0",
    "Vej4VCrDDiA",
    "jA5frNgwRyY",
    "wmfUpNIXSIs",
    "wJAEYKFqeog",
    "chLBFNVstck",
    "YVdg2fHD3OI",
    "8lFWJWdQUyM",
    "QXxHLnkZrWw",
    "Le5PAPhU_98",
    "VHZnKx0QB48",
    "3mbgXUDtO-M",
    "uHo2SUl96R4",
    "eE_WNdv4xds",
    "fZE_9xTqAd4",
    "8fXduC2_6H4",
    "pxt6uWEcOSo",
    "ntXA36jv_28",
    "Gxctv4pQl0s",
    "Z9nHLdDRejA",
    "8inDy7FfHW4"
  ],
  "education": [
    "b9QPNk-hvjw",
    "Ud7oTgbn8nE",
    "GWvMwA6h288",
    "8YZrKVTP6Bk",
    "9ajLNvWvJxg",
    "rvNRvvbxQPI"
  ],
  "corporate": [
    "yKUOWrPUj8g",
    "i-WL85Tcxao",
    "CLB2u1XJivo",
    "nDoHhAa_WsU",
    "EohK-meijbY",
    "eEudYTaIN4c",
    "2FWt8g6fwEg",
    "aLf7DVM1xZM",
    "5_xEJKCuSXo",
    "PunUYRG3rrk"
  ],
  "event": [
    "cHqNdX-ajMo",
    "fyAClbFYGkk",
    "kHr2-a-Dxmw",
    "Ado7fUgLTAM",
    "8zEHy0RnBuw",
    "-tYZywBUA5k",
    "_WMHDvE8418",
    "XzxAPe48yQU",
    "UFnQrjK_dr4",
    "EBK0GEHVldA",
    "rHDmaW4jboc"
  ],
  "school-activities": [
    "L670u6EYXAQ",
    "VxIk_SZeqXk"
  ]
};

export const CURATED_PORTFOLIO_LIBRARY: PortfolioVideoEntry[] =
  (Object.entries(CURATED_IDS) as [PortfolioCategorySlug, string[]][])
    .flatMap(([category, ids]) =>
      ids.map((id, index) => ({
        id: `${category}-${String(index + 1).padStart(2, "0")}`,
        category,
        order: index + 1,
        videoId: id,
      }))
    );

export function portfolioVideoThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function portfolioVideosForCategory(
  slug: PortfolioCategorySlug,
  cmsProjects: Project[] = []
): PortfolioLibraryWork[] {
  const category = getPortfolioCategory(slug);
  const cmsByVideo = new Map<string, Project>();

  for (const project of cmsProjects) {
    if (project.video?.type !== "youtube") continue;
    const id = youtubeVideoId(project.video.src);
    if (id) cmsByVideo.set(id, project);
  }

  return CURATED_PORTFOLIO_LIBRARY
    .filter((entry) => entry.category === slug)
    .sort((a, b) => a.order - b.order)
    .map((entry) => {
      const matched = cmsByVideo.get(entry.videoId);
      const orderLabel = String(entry.order).padStart(2, "0");

      return {
        id: entry.id,
        videoId: entry.videoId,
        category: entry.category,
        order: entry.order,
        title: matched?.title || `Selected Work ${orderLabel}`,
        subtitle: matched?.subtitle || category.title,
        client: matched?.client || "Lungnuad Production",
        year: matched?.year || "Portfolio",
        cover: matched?.cover || portfolioVideoThumbnail(entry.videoId),
        projectSlug: matched?.slug,
      };
    });
}

export function totalPortfolioVideos() {
  return CURATED_PORTFOLIO_LIBRARY.length;
}
