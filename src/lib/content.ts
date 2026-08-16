
import raw from "@/content/content.json";

export type VideoInfo = {
  type: "youtube" | "mp4" | "vimeo" | "none";
  src: string;
};

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

export type SiteContent = {
  site: {
    brand: string;
    tagline: string;
    email: string;
    facebookLabel: string;
    facebookUrl: string;
    serviceArea: string;
  };
  services: { title: string; text: string }[];
  reviews: { quote: string; name: string; role: string }[];
  projects: Project[];
};

export const content = raw as SiteContent;
export const projects = content.projects;
export const services = content.services;
export const reviews = content.reviews;
export const site = content.site;
