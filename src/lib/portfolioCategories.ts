import type { Project } from "@/lib/cms";

export type PortfolioCategorySlug =
  | "commercial"
  | "education"
  | "corporate"
  | "event"
  | "school-activities";

export type PortfolioCategory = {
  slug: PortfolioCategorySlug;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
};

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    slug: "commercial",
    title: "Commercial / Advertising",
    eyebrow: "BRAND / PRODUCT / FOOD / CAMPAIGN",
    description:
      "งานโฆษณา Brand Film, Product, Food, Restaurant และ Social Content ที่เล่าแบรนด์ให้ดูชัดและน่าจดจำ",
    keywords: ["commercial", "advertising", "tvc", "product", "beauty", "food", "restaurant", "cafe", "café", "sushi", "โฆษณา", "สินค้า", "ร้านอาหาร"],
  },
  {
    slug: "education",
    title: "Education",
    eyebrow: "EDUCATION / UNIVERSITY / TRAINING",
    description:
      "งานสื่อการศึกษา มหาวิทยาลัย การอบรม สัมมนา และ Presentation ที่ต้องการสื่อสารข้อมูลให้เข้าใจง่ายและดูเป็นมืออาชีพ",
    keywords: ["education", "university", "training", "seminar", "การศึกษา", "มหาวิทยาลัย", "อบรม", "สัมมนา"],
  },
  {
    slug: "corporate",
    title: "Corporate / Presentation",
    eyebrow: "CORPORATE / ORGANIZATION / PRESENTATION",
    description:
      "งานแนะนำองค์กร บริษัท โรงแรม โรงพยาบาล และโครงการต่าง ๆ ที่เน้นภาพลักษณ์ ความน่าเชื่อถือ และเรื่องราวขององค์กร",
    keywords: ["corporate", "presentation", "hospital", "hotel", "company", "organization", "บริษัท", "องค์กร", "โรงพยาบาล", "โรงแรม"],
  },
  {
    slug: "event",
    title: "Event",
    eyebrow: "EVENT / CEREMONY / DOCUMENTARY",
    description:
      "งานอีเวนต์ พิธีสำคัญ Wedding, Documentary, PR และเบื้องหลัง ที่เน้นบรรยากาศจริงและอารมณ์ของเหตุการณ์",
    keywords: ["event", "documentary", "wedding", "sport", "behind", "bts", "pr", "พิธี", "แต่งงาน", "งานแต่ง"],
  },
  {
    slug: "school-activities",
    title: "School Activities",
    eyebrow: "SCHOOL / KINDERGARTEN / CLASSROOM",
    description:
      "งานกิจกรรมโรงเรียน อนุบาล ห้องเรียน Field Trip และการเรียนรู้ ที่เล่าเรื่องเด็ก ๆ และบรรยากาศการเรียนรู้ให้ดูสดใสเป็นธรรมชาติ",
    keywords: ["school", "kindergarten", "classroom", "field trip", "kids", "อนุบาล", "โรงเรียน", "กิจกรรม", "ห้องเรียน"],
  },
];

export function isPortfolioCategorySlug(value: string): value is PortfolioCategorySlug {
  return PORTFOLIO_CATEGORIES.some((category) => category.slug === value);
}

export function getPortfolioCategory(slug: PortfolioCategorySlug) {
  return PORTFOLIO_CATEGORIES.find((category) => category.slug === slug)!;
}

export function portfolioCategoryPath(slug: PortfolioCategorySlug) {
  return `/projects/category/${slug}`;
}

export function categoryForProject(project: Project): PortfolioCategorySlug {
  const hay =
    `${project.category} ${project.tags.join(" ")} ${project.title} ${project.subtitle} ${project.client}`.toLowerCase();

  const school = getPortfolioCategory("school-activities");
  if (school.keywords.some((keyword) => hay.includes(keyword))) return school.slug;

  const education = getPortfolioCategory("education");
  if (education.keywords.some((keyword) => hay.includes(keyword))) return education.slug;

  const corporate = getPortfolioCategory("corporate");
  if (corporate.keywords.some((keyword) => hay.includes(keyword))) return corporate.slug;

  const event = getPortfolioCategory("event");
  if (event.keywords.some((keyword) => hay.includes(keyword))) return event.slug;

  return "commercial";
}

export function projectsForCategory(projects: Project[], slug: PortfolioCategorySlug) {
  return projects.filter((project) => categoryForProject(project) === slug);
}
