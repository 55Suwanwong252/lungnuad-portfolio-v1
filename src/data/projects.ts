
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  cover: string;
  vertical: string;
  description: string;
  tags: string[];
  featured?: boolean;
};

const img = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const projects: Project[] = [
  {
    slug: "perfect-d1-all-in-one-serum",
    title: "PERFECT D1",
    subtitle: "ALL IN ONE SERUM",
    category: "TVC / Commercial",
    client: "PERFECT D1",
    year: "Portfolio",
    cover: img("photo-1598440947619-2c35fc9aa908"),
    vertical: img("photo-1598440947619-2c35fc9aa908", 1200),
    description: "ภาพยนตร์โฆษณาเซรั่มบำรุงผิวหน้า ถ่ายทอดความพรีเมียมและความงดงามของแบรนด์ด้วยงานภาพและการจัดแสงที่โดดเด่น",
    tags: ["Commercial", "Beauty", "TVC"],
    featured: true,
  },
  {
    slug: "pura-d1-perfect-whitening",
    title: "PURA D1",
    subtitle: "PERFECT WHITENING",
    category: "TVC / Commercial",
    client: "PURA D1",
    year: "Portfolio",
    cover: img("photo-1570172619644-dfd03ed5d881"),
    vertical: img("photo-1570172619644-dfd03ed5d881", 1200),
    description: "วิดีโอโฆษณาผลิตภัณฑ์เซรั่มบำรุงผิวกาย เน้นภาพลักษณ์ที่ทันสมัย สะอาด และพรีเมียม",
    tags: ["Commercial", "Beauty", "Product"],
  },
  {
    slug: "soap-d1-pura",
    title: "SOAP D1 PURA",
    subtitle: "PERFECT WHITENING",
    category: "TVC / Commercial",
    client: "PURA",
    year: "Portfolio",
    cover: img("photo-1556229010-6c3f2c9ca5f8"),
    vertical: img("photo-1556229010-6c3f2c9ca5f8", 1200),
    description: "ผลงานผลิตสื่อโฆษณาสบู่ ถ่ายทอดความสะอาด สดชื่น ความมั่นใจ และคุณภาพของผลิตภัณฑ์",
    tags: ["Commercial", "Product", "TVC"],
  },
  {
    slug: "cream-d1-all-in-one",
    title: "Cream D1",
    subtitle: "All in one cream",
    category: "TVC / Commercial",
    client: "D1",
    year: "Portfolio",
    cover: img("photo-1556228578-8c89e6adf883"),
    vertical: img("photo-1556228578-8c89e6adf883", 1200),
    description: "วิดีโอโปรโมทครีมบำรุงผิวสูตรเข้มข้น โดดเด่นด้วยงานภาพเชิงศิลปะและสีสันที่ดึงดูดสายตา",
    tags: ["Commercial", "Beauty", "Product"],
  },
  {
    slug: "tat-mana",
    title: "โฆษณา APP TAT MANA",
    subtitle: "การท่องเที่ยวนครศรีธรรมราช",
    category: "โฆษณา / PR",
    client: "TAT MANA",
    year: "Portfolio",
    cover: img("photo-1528181304800-259b08848526"),
    vertical: img("photo-1528181304800-259b08848526", 1200),
    description: "ตัวอย่างผลงานโฆษณาแอปพลิเคชัน TAT MANA เพื่อสื่อสารการท่องเที่ยวนครศรีธรรมราช",
    tags: ["PR", "Travel", "Commercial"],
  },
  {
    slug: "luckyhome-pattanakarn-4",
    title: "Luckyhome",
    subtitle: "Pattanakarn #4",
    category: "โฆษณา / PR",
    client: "Luckyhome",
    year: "Portfolio",
    cover: img("photo-1600585154340-be6161a56a0c"),
    vertical: img("photo-1600585154340-be6161a56a0c", 1200),
    description: "วิดีโอโฆษณาพรีเซนต์โครงการบ้านเดี่ยวและทาวน์โฮม เพื่อสื่อสารบรรยากาศและจุดเด่นของโครงการ",
    tags: ["Property", "PR", "Commercial"],
  },
  {
    slug: "food-science-wu",
    title: "วิทยาศาสตร์อาหารและนวัตกรรม",
    subtitle: "Walailak University",
    category: "Presentation / Education",
    client: "มหาวิทยาลัยวลัยลักษณ์",
    year: "Portfolio",
    cover: img("photo-1532094349884-543bc11b234d"),
    vertical: img("photo-1532094349884-543bc11b234d", 1200),
    description: "วิดีโอแนะนำหลักสูตรและห้องปฏิบัติการ เพื่อถ่ายทอดภาพการเรียนรู้ที่ทันสมัยของมหาวิทยาลัยวลัยลักษณ์",
    tags: ["Education", "Presentation", "University"],
  },
  {
    slug: "toshiba-run-2020",
    title: "Toshiba Run 2020",
    subtitle: "ขนอม-สิชล คนเมืองคอน",
    category: "Presentation / Event",
    client: "Toshiba Run",
    year: "2020",
    cover: img("photo-1552674605-db6ffd4facb5"),
    vertical: img("photo-1552674605-db6ffd4facb5", 1200),
    description: "บรรยากาศงานวิ่งการกุศลขนอม-สิชล ถ่ายทอดพลังของผู้ร่วมงานและบรรยากาศเส้นทางริมทะเลแดนใต้",
    tags: ["Event", "Presentation", "Sport"],
  },
  {
    slug: "ruts-management-technology",
    title: "คณะเทคโนโลยีการจัดการ",
    subtitle: "มทร.ศรีวิชัย",
    category: "Behind the Scene / PR",
    client: "มทร.ศรีวิชัย",
    year: "Portfolio",
    cover: img("photo-1523240795612-9a054b0db644"),
    vertical: img("photo-1523240795612-9a054b0db644", 1200),
    description: "วิดีโอแนะนำคณะและหลักสูตรด้านเทคโนโลยีและการจัดการนวัตกรรม พร้อมภาพเบื้องหลังการผลิต",
    tags: ["Education", "PR", "BTS"],
  },
  {
    slug: "phipun-hospital-2024",
    title: "PHIPUN HOSPITAL",
    subtitle: "Corporate Presentation 2024",
    category: "Presentation / Corporate",
    client: "โรงพยาบาลพิปูน",
    year: "2024",
    cover: img("photo-1538108149393-fbbd81895907"),
    vertical: img("photo-1538108149393-fbbd81895907", 1200),
    description: "ภาพยนตร์สั้นพรีเซนเทชั่นนำเสนอคุณภาพ การบริการ และภาพลักษณ์ของโรงพยาบาลพิปูน",
    tags: ["Corporate", "Hospital", "Presentation"],
  },
];
