import raw from "@/content/cms-default.json";

export type VideoInfo = { type: "youtube" | "mp4" | "vimeo" | "none"; src: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  description: string;
  tags: string[];
  cover: string;
  vertical: string;
  gallery: string[];
  video: VideoInfo;
  featured?: boolean;
};

export type GalleryItem = {
  id: string;
  image: string;
  title: string;
  caption: string;
  projectSlug?: string;
};

export type CmsContent = {
  site: {
    brand: string; tagline: string; email: string; facebookLabel: string;
    facebookUrl: string; serviceArea: string;
  };
  services: { title: string; text: string }[];
  reviews: { quote: string; name: string; role: string }[];
  projects: Project[];
  home: {
    coverUrl: string; heroEyebrow: string; heroTitle: string; heroTitleThai: string;
    heroDescription: string; primaryCta: string; secondaryCta: string;
    selectedHeading: string; servicesHeading: string; latestHeading: string;
    profileRole: string; profileName: string; profileTagline: string;
    profileDescription: string; profileTags: string[]; experience: string; location: string;
  };
  projectsPage: {
    profileName: string; tagline: string; description: string; tags: string[];
    heading: string; coverUrl: string; experience: string; location: string;
  };
  galleryPage: {
    eyebrow: string; title: string; description: string; items: GalleryItem[];
  };
  aboutPage: {
    eyebrow: string; title: string; description: string; cta: string;
    stats: { value: string; label: string }[];
  };
  contactPage: { eyebrow: string; title: string; description: string };
  homeReel: {
    selectedUrl: string; eyebrow: string; title: string; caption: string;
    ctaLabel: string; scrollLabel: string; showSound: boolean; showShare: boolean;
    showCta: boolean; textSize: "small" | "medium" | "large";
    textAlign: "left" | "center"; textColor: "white" | "dark"; overlayOpacity: number;
  };
  reelMeta: Record<string, { title?: string; caption?: string; enabled?: boolean }>;
  reelOrder: string[];
  navigation: {
    home: string; reels: string; projects: string; gallery: string;
    more: string; about: string; contact: string;
  };
};

export const defaultCms = raw as CmsContent;
